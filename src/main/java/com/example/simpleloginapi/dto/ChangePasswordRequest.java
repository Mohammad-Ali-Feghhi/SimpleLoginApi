package com.example.simpleloginapi.dto;

import jakarta.validation.constraints.NotBlank;

public class ChangePasswordRequest {

    @NotBlank(message = "رمز عبور فعلی را وارد نمائید")
    private String currentPassword;

    @NotBlank(message = "رمز عبور جدید را وارد نمائید")
    private String newPassword;

    @NotBlank(message = "تکرار رمز عبور جدید را وارد نمائید")
    private String confirmPassword;

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }
    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
    public String getNewPassword() {
        return newPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
    public String getConfirmPassword() {
        return confirmPassword;
    }
}
