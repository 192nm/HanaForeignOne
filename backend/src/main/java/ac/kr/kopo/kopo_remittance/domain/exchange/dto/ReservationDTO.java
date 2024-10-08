package ac.kr.kopo.kopo_remittance.domain.exchange.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class ReservationDTO {
    private Long reservationId;      // 예약 ID (시퀀스 사용)
    private String userId;           // 사용자 ID
    private BigDecimal amount;       // 환전할 금액
    private String currencyCode;     // 통화 코드
    private BigDecimal targetRate;   // 목표 환율
    private Date startDate;          // 시작 날짜
    private Date endDate;            // 종료 날짜
    private String status;           // 상태 ('PENDING', 'COMPLETED', 'EXPIRED')
    private String exchangeDirection; // 'KRW_TO_OTHER' 또는 'OTHER_TO_KRW'
}
