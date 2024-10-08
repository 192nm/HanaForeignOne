package ac.kr.kopo.kopo_remittance.domain.logged.service;
import ac.kr.kopo.kopo_remittance.domain.logged.dto.RemiAllLog;
import ac.kr.kopo.kopo_remittance.domain.logged.dto.FxLogDTO;
import ac.kr.kopo.kopo_remittance.domain.logged.dto.RemiLogDTO;
import ac.kr.kopo.kopo_remittance.domain.logged.mapper.LoggedMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoggedService {
    private final LoggedMapper loggedMapper;

    public LoggedService(LoggedMapper loggedMapper) {
        this.loggedMapper = loggedMapper;
    }

    public List<FxLogDTO> getFxLogById(String id) {
        return loggedMapper.fxLogById(id);
    }
    public List<RemiLogDTO> getRemittanceLogsById(String id) {
        return loggedMapper.findRemittanceLogsById(id);
    }

    public List<RemiAllLog> remiLogGet(String id) {
        List<RemiAllLog> result = loggedMapper.remiLogGet(id);
        System.out.println("Query Result: " + result); // 로그로 확인
        return result;
    }
}
