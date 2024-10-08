package ac.kr.kopo.kopo_remittance.domain.expect.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RequestAdviceDTO {
    private String currency;
    private String date;
    private BigDecimal targetRatio;
}
