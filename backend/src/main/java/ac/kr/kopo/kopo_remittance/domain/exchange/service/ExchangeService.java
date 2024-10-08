package ac.kr.kopo.kopo_remittance.domain.exchange.service;

import ac.kr.kopo.kopo_remittance.domain.exchange.dto.ExchangeReservationRequestDTO;
import ac.kr.kopo.kopo_remittance.domain.exchange.dto.ReservationDTO;
import ac.kr.kopo.kopo_remittance.domain.exchange.dto.TransactionDTO;
import ac.kr.kopo.kopo_remittance.domain.exchange.mapper.ExchangeMapper;
import ac.kr.kopo.kopo_remittance.domain.mail.service.MailServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExchangeService {

    @Autowired
    private ExchangeMapper exchangeMapper;

    @Autowired
    private MailServiceInter mailService; // 메일 서비스 주입

    /**
     * KRW를 다른 통화로 환전하는 메서드
     *
     * @param userId       사용자 ID
     * @param amount       환전할 금액 (외화 기준)
     * @param currencyCode 대상 통화 코드 (예: "USD")
     */
    @Transactional
    public void krwToOther(String userId, BigDecimal amount, String currencyCode) {
        // 입력 값 검증
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("환전 금액은 0보다 커야 합니다.");
        }

        if (!isValidCurrencyCode(currencyCode)) {
            throw new IllegalArgumentException("지원하지 않는 통화 코드입니다: " + currencyCode);
        }

        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        params.put("amount", amount);
        params.put("currencyCode", currencyCode);

        try {
            // 환전 로직 수행
            exchangeMapper.krwToOther(params);

            // 환율 조회 (STANDARD_RATE)
            BigDecimal standardRate = exchangeMapper.getStandardRate(currencyCode);

            // JPY의 경우 100엔 단위로 환율 적용
            if ("JPY".equals(currencyCode)) {
                standardRate = standardRate.divide(new BigDecimal("100"), MathContext.DECIMAL128);
            }

            // 원화로 환산된 금액 계산
            BigDecimal amountInKrw = amount.multiply(standardRate);

            // 송신 계좌 번호 (KRW 계좌)
            String sdAccount = exchangeMapper.getKRWAccountNumber(userId);

            // 수신 계좌 번호 (외화 계좌)
            String rcAccount = exchangeMapper.getForeignCurrencyAccountNumber(userId, currencyCode);

            // 거래 내역 생성
            TransactionDTO transaction = new TransactionDTO();
            transaction.setId(userId);
            transaction.setCurrencyCode(currencyCode);
            transaction.setTransactionDate(new Date());
            transaction.setAmount(amount);
            transaction.setAmountInKrw(amountInKrw);
            transaction.setTransactionType("환전(구매)");
            transaction.setRcAccount(rcAccount);
            transaction.setSdAccount(sdAccount);
            transaction.setTranStatus("완료"); // TRAN_STATUS 설정

            // 거래 내역 저장
            exchangeMapper.insertTransaction(transaction);

            // 이메일 발송: 환전 완료
            sendExchangeCompletedEmail(userId, amount, currencyCode, amountInKrw);

        } catch (Exception e) {
            // 예외 처리
            throw new RuntimeException("환전 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 외화를 KRW로 환전하는 메서드
     *
     * @param userId       사용자 ID
     * @param amount       환전할 금액 (외화 기준)
     * @param currencyCode 환전할 외화 코드 (예: "USD")
     */
    @Transactional
    public void otherToKrw(String userId, BigDecimal amount, String currencyCode) {
        // 입력 값 검증
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("환전 금액은 0보다 커야 합니다.");
        }

        if (!isValidCurrencyCode(currencyCode)) {
            throw new IllegalArgumentException("지원하지 않는 통화 코드입니다: " + currencyCode);
        }

        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        params.put("amount", amount);
        params.put("currencyCode", currencyCode);

        try {
            // 환전 로직 수행
            exchangeMapper.otherToKrw(params);

            // 환율 조회 (STANDARD_RATE)
            BigDecimal standardRate = exchangeMapper.getStandardRate(currencyCode);

            // JPY의 경우 100엔 단위로 환율 적용
            if ("JPY".equals(currencyCode)) {
                standardRate = standardRate.divide(new BigDecimal("100"), MathContext.DECIMAL128);
            }

            // 원화로 환산된 금액 계산
            BigDecimal amountInKrw = amount.multiply(standardRate);

            // 송신 계좌 번호 (외화 계좌)
            String sdAccount = exchangeMapper.getForeignCurrencyAccountNumber(userId, currencyCode);

            // 수신 계좌 번호 (KRW 계좌)
            String rcAccount = exchangeMapper.getKRWAccountNumber(userId);

            // 거래 내역 생성
            TransactionDTO transaction = new TransactionDTO();
            transaction.setId(userId);
            transaction.setCurrencyCode(currencyCode);
            transaction.setTransactionDate(new Date());
            transaction.setAmount(amount);
            transaction.setAmountInKrw(amountInKrw);
            transaction.setTransactionType("환전(판매)");
            transaction.setRcAccount(rcAccount);
            transaction.setSdAccount(sdAccount);
            transaction.setTranStatus("완료"); // TRAN_STATUS 설정

            // 거래 내역 저장
            exchangeMapper.insertTransaction(transaction);

            // 이메일 발송: 환전 완료
            sendExchangeCompletedEmail(userId, amount, currencyCode, amountInKrw);

        } catch (Exception e) {
            // 예외 처리
            throw new RuntimeException("환전 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 환전 예약을 생성하고 이메일을 발송하는 메서드
     *
     * @param request 예약 요청 DTO
     */
    @Transactional
    public void reserveExchange(ExchangeReservationRequestDTO request) {
        // 입력 값 검증
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("환전 금액은 0보다 커야 합니다.");
        }

        if (!isValidCurrencyCode(request.getCurrencyCode())) {
            throw new IllegalArgumentException("지원하지 않는 통화 코드입니다: " + request.getCurrencyCode());
        }

        if (request.getEndDate().before(new Date())) {
            throw new IllegalArgumentException("종료 날짜는 현재 날짜 이후여야 합니다.");
        }

        if (!"KRW_TO_OTHER".equals(request.getExchangeDirection()) && !"OTHER_TO_KRW".equals(request.getExchangeDirection())) {
            throw new IllegalArgumentException("유효하지 않은 환전 방향입니다.");
        }

        // 예약 정보 생성
        ReservationDTO reservation = new ReservationDTO();
        reservation.setUserId(request.getUserId());
        reservation.setAmount(request.getAmount());
        reservation.setCurrencyCode(request.getCurrencyCode());
        reservation.setTargetRate(request.getTargetRate());
        reservation.setStartDate(new Date());
        reservation.setEndDate(request.getEndDate());
        reservation.setStatus("PENDING");
        reservation.setExchangeDirection(request.getExchangeDirection());

        // 예약 저장
        exchangeMapper.insertReservation(reservation);

        // 예약 성공 이메일 발송
        sendReservationSuccessEmail(request.getUserId(), request);
    }

    /**
     * 예약이 성공적으로 생성되었을 때 이메일을 발송하는 메서드
     *
     * @param userId  사용자 ID
     * @param request 예약 요청 DTO
     */
    private void sendReservationSuccessEmail(String userId, ExchangeReservationRequestDTO request) {
        try {
            String email = exchangeMapper.getUserEmailById(userId);
            if (email == null || email.isEmpty()) {
                System.err.println("사용자의 이메일을 찾을 수 없습니다: " + userId);
                return;
            }

            String subject = "환전 예약이 성공적으로 등록되었습니다.";
            String content = "<h1>환전 예약 확인</h1>"
                    + "<p>사용자 ID: " + request.getUserId() + "</p>"
                    + "<p>환전 금액: " + request.getAmount() + " " + request.getCurrencyCode() + "</p>"
                    + "<p>목표 환율: " + request.getTargetRate() + "</p>"
                    + "<p>예약 종료 날짜: " + request.getEndDate() + "</p>"
                    + "<p>환전 방향: " + ( "KRW_TO_OTHER".equals(request.getExchangeDirection()) ? "KRW → " + request.getCurrencyCode() : request.getCurrencyCode() + " → KRW" ) + "</p>";

            mailService.sendEmail(email, subject, content);
        } catch (Exception e) {
            // 이메일 발송 실패 시 로깅
            System.err.println("예약 성공 이메일 발송 실패: " + e.getMessage());
        }
    }

    /**
     * 환전 예약이 처리 완료되었을 때 이메일을 발송하는 메서드
     *
     * @param userId        사용자 ID
     * @param amount        환전 금액
     * @param currencyCode  통화 코드
     * @param amountInKrw   환전된 금액 (KRW 기준)
     */
    private void sendExchangeCompletedEmail(String userId, BigDecimal amount, String currencyCode, BigDecimal amountInKrw) {
        try {
            String email = exchangeMapper.getUserEmailById(userId);
            if (email == null || email.isEmpty()) {
                System.err.println("사용자의 이메일을 찾을 수 없습니다: " + userId);
                return;
            }

            String subject = "환전 예약이 처리되었습니다.";
            String content = "<h1>환전 예약 처리 완료</h1>"
                    + "<p>사용자 ID: " + userId + "</p>"
                    + "<p>환전 금액: " + amount + " " + currencyCode + "</p>"
                    + "<p>환전된 금액 (KRW 기준): " + amountInKrw + " KRW</p>"
                    + "<p>처리 날짜: " + new Date() + "</p>";

            mailService.sendEmail(email, subject, content);
        } catch (Exception e) {
            // 이메일 발송 실패 시 로깅
            System.err.println("환전 완료 이메일 발송 실패: " + e.getMessage());
        }
    }

    /**
     * 예약을 처리하고 이메일을 발송하는 메서드
     */
    @Scheduled(fixedRate = 60000) // 1분마다 실행
    @Transactional
    public void processReservations() {
        List<ReservationDTO> reservations = exchangeMapper.getPendingReservations();

        for (ReservationDTO reservation : reservations) {
            try {
                boolean processed = false;

                if ("KRW_TO_OTHER".equals(reservation.getExchangeDirection())) {
                    // 구매 환율 조회
                    BigDecimal sendBuyRate = exchangeMapper.getSendBuyRate(reservation.getCurrencyCode());

                    // JPY의 경우 100엔 단위로 환율 적용
                    if ("JPY".equals(reservation.getCurrencyCode())) {
                        sendBuyRate = sendBuyRate.divide(new BigDecimal("100"), MathContext.DECIMAL128);
                    }

                    // 현재 환율이 목표 환율 이하인지 확인
                    if (sendBuyRate.compareTo(reservation.getTargetRate()) <= 0) {
                        krwToOther(reservation.getUserId(), reservation.getAmount(), reservation.getCurrencyCode());
                        exchangeMapper.updateReservationStatus(reservation.getReservationId(), "COMPLETED");
                        processed = true;
                    }
                } else if ("OTHER_TO_KRW".equals(reservation.getExchangeDirection())) {
                    // 판매 환율 조회
                    BigDecimal receiveSellRate = exchangeMapper.getReceiveSellRate(reservation.getCurrencyCode());

                    // JPY의 경우 100엔 단위로 환율 적용
                    if ("JPY".equals(reservation.getCurrencyCode())) {
                        receiveSellRate = receiveSellRate.divide(new BigDecimal("100"), MathContext.DECIMAL128);
                    }

                    // 현재 환율이 목표 환율 이상인지 확인
                    if (receiveSellRate.compareTo(reservation.getTargetRate()) >= 0) {
                        otherToKrw(reservation.getUserId(), reservation.getAmount(), reservation.getCurrencyCode());
                        exchangeMapper.updateReservationStatus(reservation.getReservationId(), "COMPLETED");
                        processed = true;
                    }
                }

                // 환전이 완료된 경우 이메일 발송
                if (processed) {
                    sendExchangeCompletedEmail(
                            reservation.getUserId(),
                            reservation.getAmount(),
                            reservation.getCurrencyCode(),
                            exchangeMapper.getStandardRate(reservation.getCurrencyCode()).multiply(reservation.getAmount())
                    );
                }

            } catch (Exception e) {
                // 오류 발생 시 로그 출력 또는 처리
                System.err.println("예약 처리 중 오류 발생: " + e.getMessage());
            }
        }

        // 만료된 예약 상태 업데이트 및 이메일 발송
        expireReservationsAndNotify();
    }

    /**
     * 예약 만료를 처리하고 이메일을 발송하는 메서드
     */
    @Transactional
    public void expireReservationsAndNotify() {
        try {
            // 만료된 예약을 조회
            List<ReservationDTO> expiredReservations = exchangeMapper.getExpiredReservations();

            for (ReservationDTO reservation : expiredReservations) {
                // 예약 상태를 'EXPIRED'로 업데이트
                exchangeMapper.updateReservationStatus(reservation.getReservationId(), "EXPIRED");

                // 만료된 예약에 대한 이메일 발송
                sendReservationExpiredEmail(reservation.getUserId(), reservation);
            }
        } catch (Exception e) {
            System.err.println("예약 만료 처리 중 오류 발생: " + e.getMessage());
        }
    }

    /**
     * 예약이 만료되었을 때 이메일을 발송하는 메서드
     *
     * @param userId      사용자 ID
     * @param reservation 만료된 예약 DTO
     */
    private void sendReservationExpiredEmail(String userId, ReservationDTO reservation) {
        try {
            String email = exchangeMapper.getUserEmailById(userId);
            if (email == null || email.isEmpty()) {
                System.err.println("사용자의 이메일을 찾을 수 없습니다: " + userId);
                return;
            }

            String subject = "[ 하나 ForeignOne ] 고객님의 환전 예약이 만료되었습니다.";
            String content = "<h1>환전 예약 만료</h1>"
                    + "<p>사용자 ID: " + userId + "</p>"
                    + "<p>환전 금액: " + reservation.getAmount() + " " + reservation.getCurrencyCode() + "</p>"
                    + "<p>목표 환율: " + reservation.getTargetRate() + "</p>"
                    + "<p>예약 종료 날짜: " + reservation.getEndDate() + "</p>"
                    + "<p>환전 방향: " + ( "KRW_TO_OTHER".equals(reservation.getExchangeDirection()) ? "KRW → " + reservation.getCurrencyCode() : reservation.getCurrencyCode() + " → KRW" ) + "</p>";

            mailService.sendEmail(email, subject, content);
        } catch (Exception e) {
            // 이메일 발송 실패 시 로깅
            System.err.println("예약 만료 이메일 발송 실패: " + e.getMessage());
        }
    }

    // 지원하는 통화 코드인지 확인하는 메서드
    private boolean isValidCurrencyCode(String currencyCode) {
        return "USD".equals(currencyCode) || "EUR".equals(currencyCode)
                || "JPY".equals(currencyCode) || "CNY".equals(currencyCode);
    }
}
