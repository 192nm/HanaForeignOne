package ac.kr.kopo.kopo_remittance.domain.chart.controller;

import ac.kr.kopo.kopo_remittance.domain.chart.dto.ChartDTO;
import ac.kr.kopo.kopo_remittance.domain.chart.dto.RequestChartDTO;
import ac.kr.kopo.kopo_remittance.domain.chart.service.ChartService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
public class ChartController {

    private final ChartService chartService;

    public ChartController(ChartService chartService) {
        this.chartService = chartService;
    }

    @PostMapping("/showChart")
    public List<ChartDTO> showChart(@RequestBody RequestChartDTO requestChartDTO) throws IOException {
        return chartService.showChart(requestChartDTO.getTableName());
    }
}
