package ac.kr.kopo.kopo_remittance.domain.chart.dto;

import lombok.Data;

import java.sql.Date;

@Data
public class ChartDTO {
    private Date tradeDate;
    private double cashBuy;
    private double cashSell;
    private double remittanceSend;
    private double remittanceReceive;
    private double exchangeRate;
    private double changeFromPrev;
}
