import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class File {
    public static void main(String[] args){
    String fileString = "./text.txt";
     try (BufferedReader br = new BufferedReader(new FileReader(fileString))) {
        System.out.println("Hello");
            String line;
            while ((line = br.readLine()) != null) {
                //System.out.println(line);
                System.out.println("Read from file: " + line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
}
