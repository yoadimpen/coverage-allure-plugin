package coverage;

import io.qameta.allure.Aggregator;
import io.qameta.allure.Reader;
import io.qameta.allure.core.Configuration;
import io.qameta.allure.core.LaunchResults;
import io.qameta.allure.core.ResultsVisitor;

import org.apache.commons.io.IOUtils;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class CoveragePlugin implements Aggregator, Reader {

    public static final String JSON_FILE_NAME = "coverage.json";
    private static String coverageData;


    @Override
    public void aggregate(final Configuration configuration,
                          final List<LaunchResults> launches,
                          final Path outputDirectory) throws IOException {
        final Path dataFolder = Files.createDirectories(outputDirectory.resolve("data"));
        final Path dataFile = dataFolder.resolve("coverage.json");
        try (OutputStream out = Files.newOutputStream(dataFile)) {
            IOUtils.write(coverageData, out);
        }
    }


    @Override
    public void readResults(Configuration configuration, ResultsVisitor resultsVisitor, Path directory) {
        final Path coverageFile = directory.resolve(JSON_FILE_NAME);
        if (Files.exists(coverageFile)) {
            try (InputStream inputStream = Files.newInputStream(coverageFile)) {
                coverageData = IOUtils.toString(inputStream);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }else{
            System.err.println("no file "+coverageFile.getParent()+"/"+coverageFile.getFileName());
        }
    }

    public String getName() {
        return "coverage";
    }

}
