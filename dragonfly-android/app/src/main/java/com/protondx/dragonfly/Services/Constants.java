package com.protondx.dragonfly.Services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;

public class Constants {
    public static final String MyPREFERENCES = "pdx" ;
 //   public static String Base_Url="https://api.anuparamanu.xyz/api/v1/";
    // public static String Base_Url="https://staging-api.protondx.com/api/v2/";
 public static String Base_Url="https://api.mohmaya.bar/api/v2/";
   // public static String Base_Url="http://dragonflyproduction-env.eba-ra4maftz.eu-west-2.elasticbeanstalk.com/api/v2";

  //  public static String Base_Url2="https://api.anuparamanu.xyz/api/v2/";

    public static String add_Result=Base_Url+"addresult";
    public static String auth_token="auth-wpf-desktop";
    public static String get_users=Base_Url+"users?number_of_rows_per_page=10&current_page=1";

    public static String auth0_login=Base_Url+"auth0login";
    public static String get_version_number=Base_Url+"version";
    public static String get_app_configuration=Base_Url+"configuration";
    public static String auth0logout=Base_Url+"auth0logout";
//   public static  String SCANDIT_LICENSE_KEY="AbUkBBDYNMGiM+J61TVH+AYiJm9gMkBS9Sb2BM5ft/2YbJab0nKdQ1AN0oeuahXcM1GImb0Kar59Y3HwaBVk7h1355tjHCE/uSopEA4G3khwBNF9cEZ0Bs9jGv+tIBJL8GOGpl9WRloWfKNVvzznVf5DLSORbQMHy3fkHPIk9pWWLYqOQkDeST9RlECfMbmzwWUtqSMGzDlddenc7nMdG3YGe2QzcrK3MCAxR2APKLJ5P0FIZCkYr8xV3OXzUK8OUH9rmiRMve8Pe+w+70G5nb9XYthhVs4ZbVGZSW16yXQWEXZVHWIShXU4xi02awA+V0CMTlx13/+eUt9ORkzVgfRzZJU5cM2b52hbsXp9+KNLFLgelkSuhY57NAtIB+HPrFfcsVhFlBKDA9yPfmVKy70OTf4tavnEJwTuEkwUPNrbPHREdEFmaklNBcJnX3khphG2ytVLZq3WAD2073z9nWtxR/HPTfVHvRm2ZA15n9LWWWonS3UBT4F4Kd6NccgFYEUpuMtYvBYxctHs018MdOpAZS11cJIN4RRR1cdsySA7vTg8Cbe68YQRldN18WPYEiCl5+ym1NW7joIOgjl4ybeEruJIwn+9GFHbhBiMzkmUgE6H3SPytO+YuOBcCRhILtb+RZ/e/1zhxyZPtp+m9dWHPC4ggYhWM0SS4J3XDgI+65078iJpgfDVwxFtJAcuA2Id3R83u68IgzmOHoWM96jBGMFnRSi468yjxV+nQdoTvSU+VH7QhZRlmnhanNuNLFppC50o3FUhdJPmShVmfxEPezZGELHq/vA73DBS/FvJ9AJegDS/CoNO83CjIMPf5MMUIGt5rh//q3K/bI6vWwj76N9Lv529Ea2yOVgPMsz2gVOFRGfbdOxzFXrfRRAWM9tTMJCwJgYbrjushZF9s9D/nps6cVOVCa579E787WGI9BNnvwNM64xvVt23zkFjcNL81XYCEmWDu5tyS6NKUAzftdECp2JWEgqs1sZMU8u/97j5bZO7QGkG0QXIJuNSnuYOgi1Jjwe4EnBROyteApm8EM+qdFzDJovpe9LaqbTEsNSxPwlvoQLKjwFeJkbmPAuHYbB82yRynjX+1VsH9JmvmA7xnFLdUopTV4gpHJAqPfgkks7miwFwFCnqJqTupHby+kwSem67R5a00rKJWSrdm5kFSZmHmMtRywQ4viXjNw96NbWYAbUe0yY7UwYD+OIh+U3U8GUsNbbd";

  public static  String SCANDIT_LICENSE_KEY="AQI0UJeBAwQeKA6LZgHCBjEmMbJBFJI5h2gZojNBiXAVDQWpFUts+NcPK0UZYyOG9W8PCzRNG3KHYFIgsGJSqRo3VcmgX0elHhmywZZC9gE7SXPJwmw3UBBROWJKU83il26NFQwlrPe4EHh+BkSFmbwinMAOrxGeZUKM8IOVd6Bjkta7V7/gDAorLGgip72xvQRKRCRGRbe8Ka3IF0Lxbcoitw6oCtJWwl+mfrmFsRs+p66nuqdMW8dKqE+NiG+v+usB0N6/KF1Aicz5ORJIhTjCV4bnhQ4CXoAK0RL9u7AVduEZWt0lov8yfEiDCsX493l5iOd81KRbPSo6+Ja/lZH6zRsbXn+T36LyPkUQyEDyur/REyDRK+OtBrdFcevZx3fPw+mF0bRbww3OtRkabIOiBn3yIOwe3f2dKDU6sngX9EfLAyN1/fzz0dgfKJJIFCmfd33LCWc/C9ia0EY302DCa1RXKQyWyXg0fga5i77/SxfDa0V4Cu+Re6LWah4odyxAS87GLiAp39nG405fmmaYUSUf7PRhMt48oaRSSSyx6XPO/13yvM0q5rtjn3UO27cIJD8mstMKKJhlc9Pcgjwy63MYwS2D0JfhBibd9hi290OBTCvwUPLq2+i1dLoiypPmxbfJOHbV459y+DTr60dX8u3tQ+WPK6gIkpO5gCNIupa9M8Vqz7grJNyVCSj0bB2bwtGqHuzsi9KLj3LH9t1bcglT1TmR8xHHX7o5rx3CB2fAMnl2ojuX3ZyJmVoZHIKV5En5a8ZGmwaTtbu34/YR7ATmGFLfQm56fmHRUKDKJCDsXdWNxIz6fXmZ2lpddNIPCw==";

    public static String convertStreamToString(InputStream is) throws UnsupportedEncodingException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is, "UTF-8"), 8);
        StringBuilder sb = new StringBuilder();
        String line = null;
        try {
            while ((line = reader.readLine()) != null) {
                sb.append(line + "\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return sb.toString();
    }
}
