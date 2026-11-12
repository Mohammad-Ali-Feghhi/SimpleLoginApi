package com.example.simpleloginapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserRequest {

    @NotBlank(message = "نام اجباری است!")
    @Size(min = 3, max = 50, message = "نام باید بین 3 تا 50 کاراکتر باشد.")
    private String firstName;

    @NotBlank(message = "نام خانوادگی اجباری است!")
    @Size(min = 3, max = 50, message = "نام خانوادگی باید بین 3 تا 50 کاراکتر باشد.")
    private String lastName;

    @NotBlank(message = "نام کاربری اجباری است!")
    @Size(min = 5, max = 100, message = "نام کاربری باید بین 5 تا 100 کاراکتر باشد.")
    private String userName;

    @NotBlank(message = "رمز عبور اجباری است!")
    @Size(min = 8, max = 100, message = "رمز عبور باید بین 8 تا 100 کاراکتر باشد.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).+$",
            message = "رمز عبور باید حداقل شامل یک حرف بزرگ، یک حرف کوچک، یک عدد و یک کاراکتر ویژه باشد."
    )
    private String password;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
