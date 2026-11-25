package com.calendario.convivios.controller;

import com.calendario.convivios.dto.PhotoResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Base64;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:photos-test;DB_CLOSE_DELAY=-1",
        "app.upload-path=target/test-uploads"
})
@AutoConfigureMockMvc
class ConviviosControllerTest {

    private static final byte[] PNG = Base64.getDecoder().decode(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void uploadPhotoPersistsMetadataAndServesImage() throws Exception {
        MockMultipartFile photo = new MockMultipartFile(
                "photo", "memory.png", MediaType.IMAGE_PNG_VALUE, PNG);

        MvcResult uploadResult = mockMvc.perform(multipart("/api/upload")
                        .file(photo)
                        .param("date", "2026-11-23")
                        .param("user", "Manuel")
                        .param("caption", "Um dia especial"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user").value("Manuel"))
                .andExpect(jsonPath("$.caption").value("Um dia especial"))
                .andReturn();

        PhotoResponse created = objectMapper.readValue(
                uploadResult.getResponse().getContentAsString(), PhotoResponse.class);

        mockMvc.perform(get("/api/photos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(created.id()))
                .andExpect(jsonPath("$[0].date").value("2026-11-23"));

        mockMvc.perform(get(created.url()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_PNG))
                .andExpect(content().bytes(PNG));
    }

    @Test
    void uploadRejectsUnsupportedFiles() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "photo", "document.txt", MediaType.TEXT_PLAIN_VALUE, "not an image".getBytes());

        mockMvc.perform(multipart("/api/upload")
                        .file(file)
                        .param("date", "2026-11-23")
                        .param("user", "Manuel")
                        .param("caption", ""))
                .andExpect(status().isBadRequest());
    }
}
