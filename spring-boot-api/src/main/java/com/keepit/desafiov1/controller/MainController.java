package com.keepit.desafiov1.controller;

import java.io.IOException;
import java.util.Map;

import javax.xml.parsers.ParserConfigurationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

import com.keepit.desafiov1.models.Registro;
import com.keepit.desafiov1.repository.RegisterRepository;
import com.keepit.desafiov1.utils.XmlUtils;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(maxAge = 3600)
@RestController
public class MainController {

    @Autowired
    XmlUtils xmlUtils;

    @Autowired
    RegisterRepository repository;

    @PostMapping(path = "upload", consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public Map<String, String> uploadFile(HttpServletRequest request)
            throws SAXException, IOException, ParserConfigurationException, InterruptedException {

        xmlUtils.sink(request.getInputStream(), repository);
        return Map.of("status", "success");
    }

    @GetMapping(path = "registros/{regiao}")
    public Page<Registro> getRegistrosRegiao(@PathVariable String regiao, @RequestParam Integer page) {

        PageRequest pageRequest = PageRequest.of(page - 1, 30);
        return this.repository.obterRegistrorPorRegiao(regiao, pageRequest);
    }

}
