package ac.kr.kopo.kopo_remittance.domain.docu.controller;

import ac.kr.kopo.kopo_remittance.domain.docu.dto.DocuDTO;
import ac.kr.kopo.kopo_remittance.domain.docu.dto.ImageDTO;
import ac.kr.kopo.kopo_remittance.domain.docu.dto.UpdateDTO;
import ac.kr.kopo.kopo_remittance.domain.docu.service.DocuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
public class DocuController {

    @Autowired
    private DocuService docuService;

    // JSON 형식으로 파일과 데이터를 받음
    @PostMapping("/upload")
    public ResponseEntity<String> uploadDocu(@RequestBody DocuDTO docuDTO) {
        try {
            // 서비스에 데이터 저장 요청
            docuService.saveDocu(docuDTO);

            return ResponseEntity.ok("Document uploaded successfully!");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to upload document: " + e.getMessage());
        }
    }

    @PostMapping("/update")
    public String updateDocu(@RequestParam("id") String id,
                                             @RequestParam("attachedImage") MultipartFile attachedImage) {
        boolean isUpdated = docuService.updateDocu(id, attachedImage);
        if (isUpdated) {
            return "서류 수정에 성공하였습니다.";
        } else {
            return "서류 수정에 실패하였습니다.";
        }
    }

    @PostMapping("/selectDocu")
    public List<ImageDTO> selectDocu(@RequestBody Map<String, String> body) {
        String id = body.get("id");
        return docuService.selectDocu(id);
    }
}
