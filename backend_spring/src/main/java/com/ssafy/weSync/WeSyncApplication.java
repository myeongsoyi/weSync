package com.ssafy.weSync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class WeSyncApplication {

	public static void main(String[] args) {
		SpringApplication.run(WeSyncApplication.class, args);
	}

}
