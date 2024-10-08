package ac.kr.kopo.kopo_remittance.domain.user.dto;

import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    private String id;
    private byte[] profile;
}
