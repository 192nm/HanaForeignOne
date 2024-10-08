// src/main/java/ac/kr/kopo/kopo_remittance/domain/realtime/service/RealTimeService.java
package ac.kr.kopo.kopo_remittance.domain.realtime.service;

import ac.kr.kopo.kopo_remittance.domain.realtime.dto.RealTimeDTO;
import ac.kr.kopo.kopo_remittance.domain.realtime.mapper.RealTimeMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RealTimeService {

    private final RealTimeMapper realTimeMapper;

    public RealTimeService(RealTimeMapper realTimeMapper) {
        this.realTimeMapper = realTimeMapper;
    }

    public List<RealTimeDTO> getExchangeRates() {
        return realTimeMapper.getExchangeRates();
    }

    public List<RealTimeDTO> getAllExchangeRates() {
        return realTimeMapper.getAllExchangeRates();
    }
}
