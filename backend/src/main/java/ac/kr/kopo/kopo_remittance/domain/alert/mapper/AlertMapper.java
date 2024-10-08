package ac.kr.kopo.kopo_remittance.domain.alert.mapper;

import ac.kr.kopo.kopo_remittance.domain.alert.dto.AlertDTO;
import org.apache.ibatis.annotations.Mapper;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface AlertMapper {
    // 알림 등록
    void insertAlert(AlertDTO alertDTO);

    // 모든 알림 조회
    List<AlertDTO> getAllAlerts();

    // 알림 삭제
    void deleteAlert(Long alertId);

    // 사용자 이메일 조회
    String getUserEmailById(String userId);

    // 현재 환율 조회
    BigDecimal getCurrentExchangeRate(String currencyCode);
}
