package ac.kr.kopo.kopo_remittance.domain.exchange.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OtherToKrwDTO {
    private String userId;
    private BigDecimal amount;
    private String currencyCode;
}
