package com.keepit.desafiov1.utils;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.IntStream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.keepit.desafiov1.models.Registro;
import com.keepit.desafiov1.repository.RegisterRepository;

@Component
public class XmlUtils {

    private static Predicate<Node> isNode = node -> node.getNodeType() == Node.ELEMENT_NODE;
    private static Function<Node, Element> castNodeElement = node -> (Element) node;
    private static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
    private static String AGENTE = "agente";
    private static String REGIAO = "regiao";
    private static String CODIGO = "codigo";
    private static String DATA = "data";
    private static String SIGLA = "sigla";
    private static String GERACAO = "geracao";
    private static String COMPRA = "compra";

    private RegisterRepository repository;

    public void sink(InputStream xmlInputStream, RegisterRepository repository)
            throws SAXException, IOException, ParserConfigurationException, InterruptedException {
        this.repository = repository;
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(xmlInputStream);
        Element root = document.getDocumentElement();
        NodeList agentes = root.getElementsByTagName(AGENTE);
        IntStream.range(0, agentes.getLength())
                .mapToObj(i -> agentes.item(i))
                .filter(isNode)
                .map(castNodeElement)
                .forEach(el -> pipe(el, REGIAO));
    }

    private void pipe(Element el1, String key) {
        NodeList list = el1.getElementsByTagName(key);
        IntStream.range(0, list.getLength())
                .mapToObj(i -> list.item(i))
                .filter(isNode)
                .map(castNodeElement)
                .forEach(el2 -> load(el1, el2));

    }

    private void load(Element el1, Element el2) {

        Registro registro = Registro.builder()
                // TODO Criada uma hash do registro para prevenir duplicatas
                .hashRegistro(el1.getElementsByTagName(CODIGO).item(0)
                        .getTextContent() + el1.getElementsByTagName(DATA).item(0).getTextContent()
                        + el2.getAttribute(SIGLA))
                .codigoAgente(el1.getElementsByTagName(CODIGO).item(0).getTextContent())
                .data(parseDate(el1.getElementsByTagName(DATA).item(0).getTextContent()))
                .siglaRegiao(el2.getAttribute(SIGLA))
                // TODO com um tempo melhor esses valores poderiam ser convertidos em tipo
                // numérico
                .geracao(getValuesAsListFromNodeList(el2, GERACAO))
                .compra(getValuesAsListFromNodeList(el2, COMPRA))
                .build();
        try {
            this.repository.save(registro);
        } catch (Exception e) {
            // TODO Deve ser logado uma mensagem melhor infornando pq o registro não foi
            // cadastrado
            System.out.println("erro ao cadastrar registro");
        }

    }

    private static List<String> getValuesAsListFromNodeList(Element element, String key) {
        NodeList nodeList = element.getElementsByTagName(key).item(0).getChildNodes();
        List<String> list = new ArrayList<>();
        for (int k = 0; k < nodeList.getLength(); k++) {
            Node valorNode = nodeList.item(k);
            if (valorNode.getNodeType() == Node.ELEMENT_NODE) {
                list.add(valorNode.getTextContent());
            }
        }
        return list;
    }

    private static Date parseDate(String dateString) {
        try {
            return dateFormat.parse(dateString);
        } catch (ParseException e) {
            return null;
        }
    }

}
