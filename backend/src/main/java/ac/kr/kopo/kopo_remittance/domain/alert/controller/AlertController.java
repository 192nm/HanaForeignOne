package ac.kr.kopo.kopo_remittance.domain.alert.controller;

import ac.kr.kopo.kopo_remittance.domain.alert.dto.AlertDTO;
import ac.kr.kopo.kopo_remittance.domain.alert.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alert")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @PostMapping("/register")
    public String registerAlert(@RequestBody AlertDTO alertDTO) {
        try {
            alertService.saveAlert(alertDTO);
            return "알림이 성공적으로 등록되었습니다.";
        } catch (Exception e) {
            e.printStackTrace();
            return "알림 등록 중 오류가 발생했습니다.";
        }
    }
}
