package ac.kr.kopo.kopo_remittance.domain.logged.dto;

import lombok.Data;

import java.util.Date;

@Data
public class RemiAllLog {
    private Date transactionDate;
//    private String transactionType;
    private String currencyCode;
    private Double amount;
    private Double amountInKrw;
    private String recipientName;
    private String recipientAccount;
    private String status;
    private String senderName;
    private String senderAccount;
}
