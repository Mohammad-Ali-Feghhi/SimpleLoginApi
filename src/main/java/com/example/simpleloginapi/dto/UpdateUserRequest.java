package com.example.simpleloginapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateUserRequest {

    @NotBlank(message = "نام را وارد نمایید")
    @Size(min = 3, max = 50, message = "نام باید بین 3 تا 50 کاراکتر باشد.")
    private String firstName;

    @NotBlank(message = "نام خانوادگی را وارد نمایید")
    @Size(min = 3, max = 50, message = "نام خانوادگی باید بین 3 تا 50 کاراکتر باشد.")
    private String lastName;

    @NotBlank(message = "نام کاربری را وارد نمایید")
    @Size(min = 5, max = 100, message = "نام کاربری باید بین 5 تا 100 کاراکتر باشد.")
    private String userName;

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
}
