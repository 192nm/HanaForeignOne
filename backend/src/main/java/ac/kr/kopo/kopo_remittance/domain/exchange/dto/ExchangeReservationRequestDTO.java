package ac.kr.kopo.kopo_remittance.domain.exchange.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class ExchangeReservationRequestDTO {
    private String userId;
    private BigDecimal amount;
    private String currencyCode;
    private BigDecimal targetRate;
    private Date endDate;
    private String exchangeDirection; // 'KRW_TO_OTHER' 또는 'OTHER_TO_KRW'
}
