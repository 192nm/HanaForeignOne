package ac.kr.kopo.kopo_remittance.domain.expect.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PredictResponseDTO {
    private String currency;
    private String date;

    @JsonProperty("predicted_exchange_rate")
    private BigDecimal predictedExchangeRate;
}
