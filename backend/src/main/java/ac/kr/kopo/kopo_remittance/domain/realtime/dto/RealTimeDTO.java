package ac.kr.kopo.kopo_remittance.domain.realtime.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RealTimeDTO {
    private String currencyName;
    private double standardRate;
    private double cashBuyRate;
    private double cashSellRate;
}
