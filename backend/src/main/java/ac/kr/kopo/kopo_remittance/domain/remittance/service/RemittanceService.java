package ac.kr.kopo.kopo_remittance.domain.remittance.service;

import ac.kr.kopo.kopo_remittance.domain.mail.service.RegisterMail;
import ac.kr.kopo.kopo_remittance.domain.remittance.dto.RemittanceReservationDTO;
import ac.kr.kopo.kopo_remittance.domain.remittance.dto.RemittanceTransactionDTO;
import ac.kr.kopo.kopo_remittance.domain.remittance.dto.SendExchangeDTO;
import ac.kr.kopo.kopo_remittance.domain.remittance.dto.SendFxDTO;
import ac.kr.kopo.kopo_remittance.domain.remittance.mapper.RemittanceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.MathContext;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@EnableScheduling  // 스케줄러 활성화
public class RemittanceService {

    @Autowired
    private RemittanceMapper remittanceMapper;

    @Autowired
    private RegisterMail registerMail; // 메일 서비스 주입

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    /**
     * 외화를 바로 송금하는 메서드
     *
     * @param sendFxDTO 송금 정보 (송금자 ID, 수취인 정보, 송금 금액, 통화 코드 등)
     */
    @Transactional
    public void sendFx(SendFxDTO sendFxDTO) {
        Map<String, Object> params = new HashMap<>();
        params.put("senderId", sendFxDTO.getSenderId());
        params.put("amount", sendFxDTO.getAmount());
        params.put("currencyCode", sendFxDTO.getCurrencyCode());
        params.put("accountNumber", sendFxDTO.getReceiverAccountNumber());
        params.put("swiftCode", sendFxDTO.getReceiverSwiftCode());
        params.put("bankCode", sendFxDTO.getReceiverBankCode());

        try {
            // 송금 로직 수행
            remittanceMapper.sendFx(params);

            // 환율 조회 (STANDARD_RATE)
            BigDecimal standardRate = remittanceMapper.getStandardRate(sendFxDTO.getCurrencyCode());

            // JPY의 경우 100엔 단위로 환율 적용
            if ("JPY".equals(sendFxDTO.getCurrencyCode())) {
                standardRate = standardRate.divide(new BigDecimal("100"), MathContext.DECIMAL128);
            }

            // 원화로 환산된 금액 계산
            BigDecimal amountInKrw = sendFxDTO.getAmount().multiply(standardRate);

            // 송신 계좌 번호 (외화 계좌)
            String sdAccount = remittanceMapper.getForeignCurrencyAccountNumber(sendFxDTO.getSenderId(), sendFxDTO.getCurrencyCode());

            // 거래 내역 생성
            RemittanceTransactionDTO transaction = new RemittanceTransactionDTO();
            transaction.setId(sendFxDTO.getSenderId());
            transaction.setCurrencyCode(sendFxDTO.getCurrencyCode());
            transaction.setTransactionDate(new Date());
            transaction.setAmount(sendFxDTO.getAmount());
            transaction.setAmountInKrw(amountInKrw);
            transaction.setTransactionType("송금");
            transaction.setRcAccount(sendFxDTO.getReceiverAccountNumber());
            transaction.setSdAccount(sdAccount);
            transaction.setTranStatus("대기"); // 송금은 기본적으로 '대기' 상태

            // 거래 내역 저장
            remittanceMapper.insertRemittanceTransaction(transaction);

        } catch (Exception e) {
            throw new RuntimeException("송금 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 원화를 환전한 후 외화를 송금하는 메서드
     *
     * @param sendExchangeDTO 송금 및 환전 정보 (송금자 ID, 송금 금액, 환전 통화 코드 등)
     */
    @Transactional
    public void sendExchange(SendExchangeDTO sendExchangeDTO) {
        Map<String, Object> params = new HashMap<>();
        params.put("senderId", sendExchangeDTO.getSenderId());
        params.put("currencyCode", sendExchangeDTO.getCurrencyCode());
        params.put("amount", sendExchangeDTO.getAmount());
        params.put("accountNumber", sendExchangeDTO.getReceiverAccountNumber());
        params.put("swiftCode", sendExchangeDTO.getReceiverSwiftCode());
        params.put("bankCode", sendExchangeDTO.getReceiverBankCode());

        try {
            // 환전 및 송금 로직 수행
            remittanceMapper.sendExchange(params);

            // 환율 조회 (STANDARD_RATE)
            BigDecimal standardRate = remittanceMapper.getStandardRate(sendExchangeDTO.getCurrencyCode());

            // JPY의 경우 100엔 단위로 환율 적용
            if ("JPY".equals(sendExchangeDTO.getCurrencyCode())) {
                standardRate = standardRate.divide(new BigDecimal("100"), MathContext.DECIMAL128);
            }

            // 원화로 환산된 금액 계산
            BigDecimal amountInKrw = sendExchangeDTO.getAmount().multiply(standardRate);

            // 송신 계좌 번호 (KRW 계좌)
            String sdAccount = remittanceMapper.getKRWAccountNumber(sendExchangeDTO.getSenderId());

            // 거래 내역 생성
            RemittanceTransactionDTO transaction = new RemittanceTransactionDTO();
            transaction.setId(sendExchangeDTO.getSenderId());
            transaction.setCurrencyCode(sendExchangeDTO.getCurrencyCode());
            transaction.setTransactionDate(new Date());
            transaction.setAmount(sendExchangeDTO.getAmount());
            transaction.setAmountInKrw(amountInKrw);
            transaction.setTransactionType("송금");
            transaction.setRcAccount(sendExchangeDTO.getReceiverAccountNumber());
            transaction.setSdAccount(sdAccount);
            transaction.setTranStatus("대기"); // 송금은 기본적으로 '대기' 상태

            // 거래 내역 저장
            remittanceMapper.insertRemittanceTransaction(transaction);

        } catch (Exception e) {
            throw new RuntimeException("환전 및 송금 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 송금 예약을 등록하는 메서드
     *
     * @param reservationDTO 송금 예약 정보
     */
    @Transactional
    public void reserveRemittance(RemittanceReservationDTO reservationDTO) {
        try {
            // 예약 상태는 기본적으로 'PENDING'
            reservationDTO.setStatus("PENDING");
            reservationDTO.setStartDate(new Date());

            // 예약 정보 저장
            remittanceMapper.insertRemittanceReservation(reservationDTO);

            // 예약 ID가 자동으로 설정되었다고 가정 (MyBatis 설정 필요)
            Long reservationId = reservationDTO.getReservationId();

            // 사용자 이메일 조회
            String userEmail = remittanceMapper.getUserEmailById(reservationDTO.getUserId());
            if (userEmail == null) {
                throw new Exception("사용자의 이메일을 찾을 수 없습니다.");
            }

            // 이메일 제목 및 내용 작성
            String subject = "송금 예약이 성공적으로 등록되었습니다.";
            String content = "<h1>송금 예약 알림</h1>"
                    + "<p>안녕하세요, " + reservationDTO.getUserId() + "님.</p>"
                    + "<p>송금 예약이 성공적으로 등록되었습니다.</p>"
                    + "<p><strong>예약 ID:</strong> " + reservationDTO.getReservationId() + "</p>"
                    + "<p><strong>송금 금액:</strong> " + reservationDTO.getAmount() + " " + reservationDTO.getCurrencyCode() + "</p>"
                    + "<p><strong>목표 환율:</strong> " + reservationDTO.getTargetRate() + "</p>"
                    + "<p><strong>송금 유형:</strong> " + ( "SEND_FX".equals(reservationDTO.getRemittanceType()) ? "외화 송금" : "원화 환전 후 송금" ) + "</p>"
                    + "<p><strong>예약 기간:</strong> " + dateFormat.format(reservationDTO.getStartDate()) + " ~ " + dateFormat.format(reservationDTO.getEndDate()) + "</p>"
                    + "<p>송금 예약을 관리하려면 로그인 후 확인해주세요.</p>";

            // 이메일 발송
            registerMail.sendEmail(userEmail, subject, content);

        } catch (Exception e) {
            throw new RuntimeException("송금 예약 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 예약된 송금을 처리하는 스케줄러 메서드
     * 일정 시간마다 실행되어 예약된 송금을 처리합니다.
     */
    @Scheduled(fixedRate = 90000) // 1분마다 실행
    @Transactional
    public void processRemittanceReservations() {
        List<RemittanceReservationDTO> reservations = remittanceMapper.getPendingRemittanceReservations();
        System.out.println("Found " + reservations.size() + " pending remittance reservations.");

        for (RemittanceReservationDTO reservation : reservations) {
            try {
                System.out.println("Processing reservation ID: " + reservation.getReservationId());

                // 현재 환율 조회
                BigDecimal currentRate = remittanceMapper.getStandardRate(reservation.getCurrencyCode());

                // JPY의 경우 100엔 단위로 환율 적용
                if ("JPY".equals(reservation.getCurrencyCode())) {
                    currentRate = currentRate.divide(new BigDecimal("100"), MathContext.DECIMAL128);
                }

                boolean shouldProcess = false;

                // 목표 환율에 도달했는지 확인
                if (currentRate.compareTo(reservation.getTargetRate()) <= 0) {
                    shouldProcess = true;
                }

                if (shouldProcess) {
                    // 예약된 송금 처리 로직 수행
                    if ("SEND_FX".equals(reservation.getRemittanceType())) {
                        // 외화를 바로 송금
                        SendFxDTO sendFxDTO = new SendFxDTO();
                        sendFxDTO.setSenderId(reservation.getUserId());
                        sendFxDTO.setCurrencyCode(reservation.getCurrencyCode());
                        sendFxDTO.setAmount(reservation.getAmount());
                        sendFxDTO.setReceiverAccountNumber(reservation.getReceiverAccount());
                        sendFxDTO.setReceiverSwiftCode(reservation.getReceiverSwiftCode());
                        sendFxDTO.setReceiverBankCode(reservation.getReceiverBankCode());

                        sendFx(sendFxDTO);
                    } else if ("SEND_EXCHANGE".equals(reservation.getRemittanceType())) {
                        // 원화를 환전 후 송금
                        SendExchangeDTO sendExchangeDTO = new SendExchangeDTO();
                        sendExchangeDTO.setSenderId(reservation.getUserId());
                        sendExchangeDTO.setCurrencyCode(reservation.getCurrencyCode());
                        sendExchangeDTO.setAmount(reservation.getAmount());
                        sendExchangeDTO.setReceiverAccountNumber(reservation.getReceiverAccount());
                        sendExchangeDTO.setReceiverSwiftCode(reservation.getReceiverSwiftCode());
                        sendExchangeDTO.setReceiverBankCode(reservation.getReceiverBankCode());

                        sendExchange(sendExchangeDTO);
                    }

                    // 예약 상태를 'COMPLETED'로 업데이트
                    remittanceMapper.updateRemittanceReservationStatus(reservation.getReservationId(), "COMPLETED");
                    System.out.println("Reservation ID " + reservation.getReservationId() + " processed successfully.");

                    // 사용자 이메일 조회
                    String userEmail = remittanceMapper.getUserEmailById(reservation.getUserId());
                    if (userEmail == null) {
                        throw new Exception("사용자의 이메일을 찾을 수 없습니다.");
                    }

                    // 이메일 제목 및 내용 작성
                    String subject = "송금 예약이 처리되었습니다.";
                    String content = "<h1>송금 예약 처리 완료</h1>"
                            + "<p>안녕하세요, " + reservation.getUserId() + "님.</p>"
                            + "<p>송금 예약(ID: " + reservation.getReservationId() + ")이 성공적으로 처리되었습니다.</p>"
                            + "<p><strong>송금 금액:</strong> " + reservation.getAmount() + " " + reservation.getCurrencyCode() + "</p>"
                            + "<p><strong>목표 환율:</strong> " + reservation.getTargetRate() + "</p>"
                            + "<p><strong>송금 유형:</strong> " + ( "SEND_FX".equals(reservation.getRemittanceType()) ? "외화 송금" : "원화 환전 후 송금" ) + "</p>"
                            + "<p><strong>처리 날짜:</strong> " + dateFormat.format(new Date()) + "</p>"
                            + "<p>자세한 내용은 계정 내 거래 내역을 확인해주세요.</p>";

                    // 이메일 발송
                    registerMail.sendEmail(userEmail, subject, content);

                } else if (reservation.getEndDate().before(new Date())) {
                    // 예약 기간이 만료된 경우 상태를 'EXPIRED'로 업데이트
                    remittanceMapper.updateRemittanceReservationStatus(reservation.getReservationId(), "EXPIRED");
                    System.out.println("Reservation ID " + reservation.getReservationId() + " expired.");

                    // 사용자 이메일 조회
                    String userEmail = remittanceMapper.getUserEmailById(reservation.getUserId());
                    if (userEmail == null) {
                        throw new Exception("사용자의 이메일을 찾을 수 없습니다.");
                    }

                    // 이메일 제목 및 내용 작성
                    String subject = "송금 예약이 만료되었습니다.";
                    String content = "<h1>송금 예약 만료 알림</h1>"
                            + "<p>안녕하세요, " + reservation.getUserId() + "님.</p>"
                            + "<p>송금 예약(ID: " + reservation.getReservationId() + ")이 설정된 기간 내에 처리되지 않아 만료되었습니다.</p>"
                            + "<p><strong>송금 금액:</strong> " + reservation.getAmount() + " " + reservation.getCurrencyCode() + "</p>"
                            + "<p><strong>목표 환율:</strong> " + reservation.getTargetRate() + "</p>"
                            + "<p><strong>송금 유형:</strong> " + ( "SEND_FX".equals(reservation.getRemittanceType()) ? "외화 송금" : "원화 환전 후 송금" ) + "</p>"
                            + "<p><strong>예약 종료 날짜:</strong> " + dateFormat.format(reservation.getEndDate()) + "</p>"
                            + "<p>자세한 내용은 계정 내 예약 내역을 확인해주세요.</p>";

                    // 이메일 발송
                    registerMail.sendEmail(userEmail, subject, content);
                }

            } catch (Exception e) {
                System.err.println("Error processing reservation ID " + reservation.getReservationId() + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}
