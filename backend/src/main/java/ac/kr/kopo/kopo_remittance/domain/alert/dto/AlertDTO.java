package ac.kr.kopo.kopo_remittance.domain.alert.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AlertDTO {
    private Long alertId; // 알림 ID
    private String userId; // 사용자 ID
    private String currencyCode; // 통화 코드
    private BigDecimal targetRate; // 목표 환율
    private String alertCondition; // "higher" 또는 "lower"
}
