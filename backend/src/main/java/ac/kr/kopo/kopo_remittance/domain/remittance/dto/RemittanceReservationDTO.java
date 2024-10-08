package ac.kr.kopo.kopo_remittance.domain.remittance.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class RemittanceReservationDTO {
    private Long reservationId;          // 예약 ID (시퀀스 사용)
    private String userId;               // 사용자 ID
    private BigDecimal amount;           // 송금 금액
    private String currencyCode;         // 통화 코드
    private BigDecimal targetRate;       // 목표 환율
    private String receiverAccount;      // 수신자 계좌번호
    private String receiverSwiftCode;    // 수신자 SWIFT 코드
    private String receiverBankCode;     // 수신자 은행 코드
    private Date startDate;              // 예약 시작 날짜
    private Date endDate;                // 예약 종료 날짜
    private String status;               // 예약 상태 ('PENDING', 'COMPLETED', 'EXPIRED' 등)
    private String remittanceType;       // 송금 유형 ('SEND_FX' 또는 'SEND_EXCHANGE')
//    private String exchangeDirection;    // 환전 방향 ('KRW_TO_OTHER' 또는 'OTHER_TO_KRW')
}
