package com.panha.user_service.controller;

import org.springframework.web.bind.annotation.GetMapping;

public class HomeController {

    @GetMapping
    public String HomeControllerHandler(){
        return "user mircoservice for salon booking system";
    }
    
}
