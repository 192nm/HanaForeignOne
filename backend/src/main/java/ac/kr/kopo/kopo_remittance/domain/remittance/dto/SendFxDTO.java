package ac.kr.kopo.kopo_remittance.domain.remittance.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SendFxDTO {

    private String senderId;         // 송금자 ID
    private String currencyCode;     // 송금할 외화 코드 (예: USD, EUR)
    private BigDecimal amount;           // 송금 금액
    private String receiverAccountNumber; // 수신자 계좌번호
    private String receiverSwiftCode;     // 수신자 SWIFT 코드
    private String receiverBankCode;      // 수신자 은행 코드
}
