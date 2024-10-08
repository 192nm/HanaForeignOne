package ac.kr.kopo.kopo_remittance.domain.user.controller;

import ac.kr.kopo.kopo_remittance.domain.user.dto.LoginRequestDTO;
import ac.kr.kopo.kopo_remittance.domain.user.entity.NoProfileEntity;
import ac.kr.kopo.kopo_remittance.domain.user.entity.UserEntity;
import ac.kr.kopo.kopo_remittance.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/userJoin")
    public String joinUser(@RequestBody NoProfileEntity noProfileEntity) {
        boolean isJoined = userService.joinUser(noProfileEntity);

        if (isJoined) {
            return "회원가입에 성공하였습니다";
        } else {
            return "회원가입에 실패하였습니다";
        }
    }

    @PostMapping("/userLogin")
    public String loginUser(@RequestBody LoginRequestDTO loginRequestDTO) {
        boolean isLogined = userService.loginUser(loginRequestDTO.getId(), loginRequestDTO.getPw());

        if (isLogined) {
            return "로그인 성공";
        } else {
            return "로그인 실패";
        }
    }

    @PostMapping("/selectUserById")
    public String selectUserById(@RequestBody Map<String, String> body) {
        String id = body.get("id");
        return userService.selectUserById(id);
    }

    @PostMapping("/getUserProfile")
    public List<UserEntity> getUserProfile(@RequestBody Map<String, String> body) {
        String id = body.get("id");
        return userService.getUserProfile(id);
    }

    @PostMapping("/updateUserProfile")
    public String updateUserProfile(@RequestParam("id") String id, @RequestParam("profileImage") MultipartFile profileImage) {
        boolean isUpdated = userService.updateUserProfile(id, profileImage);

        if (isUpdated) {
            return "회원정보 수정에 성공하였습니다.";
        } else {
            return "회원정보 수정에 실패하였습니다.";
        }
    }


}