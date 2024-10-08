package ac.kr.kopo.kopo_remittance.domain.expect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PredictRequestDTO {
    private String currency;
    private String date;
}