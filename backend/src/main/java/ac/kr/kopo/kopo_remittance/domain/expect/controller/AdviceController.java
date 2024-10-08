package ac.kr.kopo.kopo_remittance.domain.expect.controller;

import ac.kr.kopo.kopo_remittance.domain.expect.dto.RequestAdviceDTO;
import ac.kr.kopo.kopo_remittance.domain.expect.service.AdviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/adviceplz")
public class AdviceController {

    @Autowired
    private AdviceService adviceService;

    @PostMapping
    public List<String> getAdvice(@RequestBody RequestAdviceDTO requestAdviceDTO) {
        return adviceService.processAdvice(requestAdviceDTO);
    }
}
