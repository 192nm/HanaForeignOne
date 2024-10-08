package ac.kr.kopo.kopo_remittance.domain.day.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ac.kr.kopo.kopo_remittance.domain.day.mapper.DayMapper;

import java.sql.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DayService {

    private final DayMapper dayMapper;

    public List<Date> getAllDays() {
        return dayMapper.getAllDays();
    }
}
