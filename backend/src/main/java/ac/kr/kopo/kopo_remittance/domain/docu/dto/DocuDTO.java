package ac.kr.kopo.kopo_remittance.domain.docu.dto;

import lombok.Data;

@Data
public class DocuDTO {
    private String userId;               // 사용자의 ID
//    private byte[] attachedImage;    // 업로드된 이미지 파일 (BLOB)
    private String ocrText;    // 추출된 텍스트 (CLOB)
}
