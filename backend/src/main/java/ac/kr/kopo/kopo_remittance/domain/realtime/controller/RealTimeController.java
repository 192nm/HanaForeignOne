// src/main/java/ac/kr/kopo/kopo_remittance/domain/realtime/controller/RealTimeController.java
package ac.kr.kopo.kopo_remittance.domain.realtime.controller;

import ac.kr.kopo.kopo_remittance.domain.realtime.dto.RealTimeDTO;
import ac.kr.kopo.kopo_remittance.domain.realtime.service.RealTimeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RealTimeController {

    private final RealTimeService realTimeService;

    public RealTimeController(RealTimeService realTimeService) {
        this.realTimeService = realTimeService;
    }

    @PostMapping("/realtime4")
    public List<RealTimeDTO> getExchangeRates() {
        return realTimeService.getExchangeRates();
    }

    @PostMapping("/realtime4All")
    public List<RealTimeDTO> getAllExchangeRates() {
        return realTimeService.getAllExchangeRates();
    }
}
