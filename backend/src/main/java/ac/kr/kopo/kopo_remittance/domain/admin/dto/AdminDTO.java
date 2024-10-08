// src/main/java/ac/kr/kopo/kopo_remittance/domain/admin/dto/AdminDTO.java

package ac.kr.kopo.kopo_remittance.domain.admin.dto;

import lombok.Data;
import java.util.Date;

@Data
public class AdminDTO {

    private Long transactionId;          // TRANSACTION_ID
    private String id;                   // ID
    private String currencyCode;         // CURRENCY_CODE
    private Date transactionDate;        // TRANSACTION_DATE
    private Double amount;               // AMOUNT
    private Double amountInKrw;          // AMOUNT_IN_KRW
    private String transactionType;      // TRANSACTION_TYPE
    private String rcAccount;            // RC_ACCOUNT
    private String sdAccount;            // SD_ACCOUNT
    private String tranStatus;           // TRAN_STATUS
    private String senderName;
    private String receiverName;
}
