package ac.kr.kopo.kopo_remittance.domain.realtime.dto;

import lombok.Data;

@Data
public class RealTimeAllCurrencyDTO {
    private String currencyCode;
    private String currencyName;
    private double standardRate;
    private double cashBuyRate;
    private double cashSellRate;
    private double sendBuyRate;
    private double receiveSellRate;
    private double buySpread;
    private double sellSpread;
}
