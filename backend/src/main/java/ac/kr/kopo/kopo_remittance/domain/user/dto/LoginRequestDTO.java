package ac.kr.kopo.kopo_remittance.domain.user.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String id;   // 사용자 아이디
    private String pw;   // 사용자 비밀번호
}
