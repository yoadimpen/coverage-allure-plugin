::friendly message

@echo off

echo Welcome to Allure Custom Report Generation!
echo.

set /p ResultsFolderPath=Directory path of your allure-results folder?
echo.

set /p GenerationFolderPath=Directory path for report generation?
echo.

set /p CoverageFilePath=Path of coverage JSON file from RESTest?
echo.

echo Proceding to generate Allure report in %GenerationFolderPath% with results from %ResultsFolderPath%.
echo.

call allure generate %ResultsFolderPath% --clean -o %GenerationFolderPath%

echo.
echo Report is generated!

pause
echo.
echo Proceding to copy coverage data to report.

call copy %CoverageFilePath% %GenerationFolderPath%\widgets\coverage.json
echo.

echo Coverage information is copied into the report!
echo.

pause

echo Make sure to copy Chart.js and Font Awesome Icons CDN to ^<head^> tag in the index.html file from the generated report:
echo.

echo ^<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"^>
echo ^<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js"^>^</script^>

pause