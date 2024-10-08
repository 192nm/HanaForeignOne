package ac.kr.kopo.kopo_remittance.domain.logged.dto;

import lombok.Data;

import java.util.Date;

@Data
public class FxLogDTO {
    private Date transactionDate;
    private String transactionType;
    private String currencyCode;
    private Double amount;
    private Double amountInKrw;
}
