package ac.kr.kopo.kopo_remittance.domain.logged.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Data
public class RemiLogDTO {
    private Date transactionDate;
    private String transactionType;
    private String currencyCode;
    private BigDecimal amount;
    private BigDecimal amountInKrw;
    private String recipientName;
}