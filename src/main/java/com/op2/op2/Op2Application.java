package com.op2.op2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.op2.op2.domain.EndUser;
import com.op2.op2.domain.EndUserRepository;

@SpringBootApplication
public class Op2Application {

	public static void main(String[] args) {
		SpringApplication.run(Op2Application.class, args);
	}

/*	@Autowired
	EndUserRepository endUserRepository;

	@Bean
	public CommandLineRunner demodata(EndUserRepository endUserRepository, BCryptPasswordEncoder bCryptPasswordEncoder){
		return (args) ->{
			if (endUserRepository.count() == 0) {
				EndUser endUser = new EndUser("testuser", "Password123!", "testuser@email.com", "user");
				String encodedPassword = bCryptPasswordEncoder.encode(endUser.getPassword());
				endUser.setPassword(encodedPassword);
				endUserRepository.save(endUser);
			}
		};
	}*/

}
