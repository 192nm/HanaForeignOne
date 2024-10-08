// src/main/java/ac/kr/kopo/kopo_remittance/domain/realtime/mapper/RealTimeMapper.java
package ac.kr.kopo.kopo_remittance.domain.realtime.mapper;

import ac.kr.kopo.kopo_remittance.domain.realtime.dto.RealTimeDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RealTimeMapper {
    List<RealTimeDTO> getExchangeRates();
    List<RealTimeDTO> getAllExchangeRates();
}
