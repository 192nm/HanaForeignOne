package ac.kr.kopo.kopo_remittance.domain.logged.controller;

import ac.kr.kopo.kopo_remittance.domain.logged.dto.FxLogDTO;
import ac.kr.kopo.kopo_remittance.domain.logged.dto.RemiAllLog;
import ac.kr.kopo.kopo_remittance.domain.logged.dto.RemiLogDTO;
import ac.kr.kopo.kopo_remittance.domain.logged.service.LoggedService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class LoggedController {
    private final LoggedService loggedService;

    public LoggedController(LoggedService loggedService) {
        this.loggedService = loggedService;
    }

    @PostMapping("/getFxLogById")
    public List<FxLogDTO> getFxLogById(@RequestParam("id") String id) {
        return loggedService.getFxLogById(id);
    }

    @PostMapping("/getRemiLogById")
    public List<RemiLogDTO> getRemittanceLogsById(@RequestParam("id") String id) {
        return loggedService.getRemittanceLogsById(id);
    }

    @PostMapping("/remiLogGet")
    public List<RemiAllLog> getRemiAllLogById(@RequestBody Map<String, String> requestData) {
        String id = requestData.get("id"); // JSON 객체에서 'id' 추출
        return loggedService.remiLogGet(id);
    }

}
