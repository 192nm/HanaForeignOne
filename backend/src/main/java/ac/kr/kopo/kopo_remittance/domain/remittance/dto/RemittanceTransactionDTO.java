package ac.kr.kopo.kopo_remittance.domain.remittance.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class RemittanceTransactionDTO {
    private Long transactionId;      // 자동 생성 (시퀀스 사용)
    private String id;               // 사용자 ID (String 타입)
    private String currencyCode;     // 통화 코드
    private Date transactionDate;    // 거래 날짜
    private BigDecimal amount;       // 거래 금액 (외화 또는 원화)
    private BigDecimal amountInKrw;  // 원화로 환산된 금액
    private String transactionType;  // 거래 유형 ('송금')
    private String rcAccount;        // 수신 계좌 번호
    private String sdAccount;        // 송신 계좌 번호
    private String tranStatus;       // 거래 상태 ('대기', '승인', '반려' 등)
}
