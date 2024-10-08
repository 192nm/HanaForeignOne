package ac.kr.kopo.kopo_remittance.domain.chart.service;

import ac.kr.kopo.kopo_remittance.domain.chart.dto.ChartDTO;
import ac.kr.kopo.kopo_remittance.domain.chart.mapper.ChartMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChartService {
    @Autowired
    private ChartMapper chartMapper;

    public List<ChartDTO> showChart(String tableName) {
        return chartMapper.showchartData(tableName);
    }
}




