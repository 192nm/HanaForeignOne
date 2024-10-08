package ac.kr.kopo.kopo_remittance.domain.day.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ac.kr.kopo.kopo_remittance.domain.day.service.DayService;

import java.sql.Date;
import java.util.List;


@RequiredArgsConstructor
@RestController
public class DayController {

    private final DayService dayService;

    @GetMapping("/days")
    public List<Date> getAllDays() {
        return dayService.getAllDays();
    }
}
