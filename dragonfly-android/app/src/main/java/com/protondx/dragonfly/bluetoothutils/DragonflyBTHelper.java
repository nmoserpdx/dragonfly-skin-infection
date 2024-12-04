package com.protondx.dragonfly.bluetoothutils;

import android.bluetooth.BluetoothDevice;
import android.os.Debug;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;

public class DragonflyBTHelper {
    static boolean commandsPrepared;

    public static HashMap<String, Integer> CommandTable = new HashMap<>();
    private static boolean prepareCommandTable() {
        if (!commandsPrepared) {
            CommandTable.put("get_version", 0x0000);
            CommandTable.put("get_id", 0x0001);
            CommandTable.put("set_ce_en", 0x1000);
            CommandTable.put("led_status_r_toggle", 0x0010);
            CommandTable.put("led_status_g_toggle", 0x0011);
            CommandTable.put("led_status_b_toggle", 0x0012);
            CommandTable.put("led_status_r_set", 0x1010);
            CommandTable.put("led_status_g_set", 0x1011);
            CommandTable.put("led_status_b_set", 0x1012);
            CommandTable.put("led_status_r_flash", 0x2010);
            CommandTable.put("led_status_g_flash", 0x2011);
            CommandTable.put("led_status_b_flash", 0x2012);
            CommandTable.put("tim2_set_pulse", 0x1101);
            CommandTable.put("tim2_get_pulse", 0x0100);
            CommandTable.put("tim3_set_period", 0x1102);
            CommandTable.put("tim3_get_period", 0x0101);
            CommandTable.put("tim3_get_pwm", 0x0102);
            CommandTable.put("dac_set_val", 0x1103);
            CommandTable.put("dac_get_val", 0x0103);
            CommandTable.put("adc_get_val", 0x0104);
            CommandTable.put("i2c_set_device", 0x1104);
            CommandTable.put("i2c_get_device", 0x0105);
            CommandTable.put("i2c_read_1", 0x1105);
            CommandTable.put("i2c_read_2", 0x1106);
            CommandTable.put("i2c_write_1", 0x2100);
            CommandTable.put("i2c_write_2", 0x2101);
            CommandTable.put("spi_transfer", 0x1107);
            CommandTable.put("spi_init", 0x0107);
            CommandTable.put("spi_deinit", 0x0108);
            CommandTable.put("sts_read", 0x2102);
            CommandTable.put("bq_soc", 0x0200);
            CommandTable.put("bq_voltage", 0x0201);
            CommandTable.put("bq_current", 0x0202);
            CommandTable.put("bq_temp", 0x0203);
            CommandTable.put("bq_cycle", 0x0204);
            CommandTable.put("bq_soh", 0x0205);
            CommandTable.put("bq_time", 0x0206);
            CommandTable.put("bq_soc_rt", 0x0210);
            CommandTable.put("bq_current_rt", 0x0211);
            CommandTable.put("bq_voltage_rt", 0x0212);
            CommandTable.put("ttn_get_clk_divpw", 0x0900);
            CommandTable.put("ttn_set_clk_divpw", 0x1900);
            CommandTable.put("ttn_get_ambient_temp", 0x0901);
            CommandTable.put("ttn_get_chamber_temp", 0x0902);
            CommandTable.put("ttn_avail", 0x0A00);
            CommandTable.put("ttn_reset", 0x0A01);
            CommandTable.put("ttn_init", 0x2A00);
            CommandTable.put("ttn_check_status", 0x0B06);
            CommandTable.put("ttn_set_rc", 0x2A01);
            CommandTable.put("ttn_read_ram", 0x0A02);
            CommandTable.put("ttn_write_ram", 0x1A00);
            CommandTable.put("ttn_read_with_vs", 0x1A01);
            CommandTable.put("ttn_get_cali_vs_tar", 0x0A03);
            CommandTable.put("ttn_set_cali_vs_tar", 0x1A02);
            CommandTable.put("ttn_chem_get_vs", 0x0A04);
            CommandTable.put("ttn_count_on_pixel", 0x0B00);
            CommandTable.put("ttn_sweep_search_vs", 0x1B00);
            CommandTable.put("ttn_binary_search_vs", 0x1B01);
            CommandTable.put("ttn_sweep_search_vref", 0x0B01);
            CommandTable.put("ttn_binary_search_vref", 0x0B02);
            CommandTable.put("ttn_eval_pixel", 0x0B03);
            CommandTable.put("ttn_cali_vs", 0x0B04);
            CommandTable.put("ttn_readout_vs", 0x0B05);
            CommandTable.put("ttn_temp_init", 0x0C00);
            CommandTable.put("ttn_temp_enable", 0x1C00);
            CommandTable.put("ttn_temp_get_vs", 0x0C01);
            CommandTable.put("ttn_temp_set_ref", 0x1C01);
            CommandTable.put("ttn_temp_get_ref", 0x0C02);
            CommandTable.put("ttn_temp_get_init", 0x1C02);
            CommandTable.put("ttn_temp_set_pwm_sum", 0x1C03);
            CommandTable.put("ttn_temp_get_pwm_sum", 0x0C03);
            CommandTable.put("quit", 0x0F00);
            CommandTable.put("list_cmd", 0x0F01);
            CommandTable.put("list_serial", 0x0F10);
            CommandTable.put("close_serial", 0x0F11);
            CommandTable.put("open_serial", 0x1F12);
         //   CommandTable.put("sleep_time_setting", 0x1F12);
            commandsPrepared = true;

        }
        return true;

    }

    private static String getStringForInteger(int toConvert) {

        return String.format("%4s", Integer.toHexString(toConvert)).replace(" ", "0");
    }

    public static byte[] getCommandToExecute(String command, int param1, int param2) {
        boolean prepd = prepareCommandTable();
        if (!CommandTable.containsKey(command)) {
            return null;
        }
        int commandInt = CommandTable.get(command);
        String finalCommand = getStringForInteger(commandInt)+getStringForInteger(param1)+getStringForInteger(param2);
        Log.d("FINALCOMMAND",finalCommand+" --For-> "+command);
        return hexStringToByteArray(finalCommand);

    }
    public static byte[] getCommandToExecute_new(String command) {
        boolean prepd = prepareCommandTable();
//        if (!CommandTable.containsKey(command)) {
//            return null;
//        }
       // int commandInt = CommandTable.get(command);

        String finalCommand = String.format("%4s",  new BigInteger(1, command.getBytes(/*YOUR_CHARSET?*/))).replace(" ", "0");
        Log.e("FINALCOMMAND",finalCommand+" --For-> "+command);
        return hexStringToByteArray(finalCommand);

    }
    private static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
//        for (int i = 0; i < len; i += 2) {
//            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
//                    + Character.digit(s.charAt(i ), 16));
//        }
      //  String str = "^&041&^";
        byte[] byteArr = s.getBytes();
        return byteArr;
    }
    public static String getBluetoothModel(BluetoothDevice bt,Boolean status)
    {
        JSONObject jsonObject=new JSONObject();
        try {
            if(bt!=null)
            {
                jsonObject.put("device_name",bt.getAlias());
                jsonObject.put("device_status",bt.getBondState());
                jsonObject.put("device_address",bt.getAddress());
                jsonObject.put("status",status);
            }

            else
            {
                jsonObject.put("status",status);

            }


        } catch (JSONException e) {
            e.printStackTrace();
        }

        return jsonObject.toString();
    }
    public static String getDeviceName(BluetoothDevice device)
    {
        String res="";
        try{
            if(device.getName().toString().isEmpty())
            {
                res=device.getAlias();
            }else
            {
                res=device.getName();
            }
        }
        catch (NullPointerException e)
        {
            try{
                res=device.getAddress();
            }catch (NullPointerException ex)
            {

            }

        }
        return res;
    }
}
