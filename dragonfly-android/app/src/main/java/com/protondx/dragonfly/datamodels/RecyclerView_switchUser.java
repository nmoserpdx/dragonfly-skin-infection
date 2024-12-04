package com.protondx.dragonfly.datamodels;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatRatingBar;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView.Adapter;
import androidx.recyclerview.widget.RecyclerView.ViewHolder;


import com.protondx.dragonfly.MainActivity;
import com.protondx.dragonfly.R;
import com.protondx.dragonfly.bluetoothutils.DragonflyBTHelper;
import com.protondx.dragonfly.interfaces.ILaceWingDeviceSearchInterface;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;

import static android.content.ContentValues.TAG;

public class RecyclerView_switchUser extends Adapter<RecyclerView_switchUser.MyViewHolder> {
    private ArrayList<BluetoothDevice>bluetoothDevices;
    private Context mcontext;
    private ILaceWingDeviceSearchInterface mcallback;


    public RecyclerView_switchUser(Context context, ArrayList<BluetoothDevice> devices, ILaceWingDeviceSearchInterface callback) {
        mcontext = context;
        bluetoothDevices = devices;
        mcallback=callback;
    }

    public MyViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        return new MyViewHolder(LayoutInflater.from(mcontext).inflate(R.layout.item_user, viewGroup, false));
    }

    public void onBindViewHolder(MyViewHolder myViewHolder, @SuppressLint("RecyclerView") int i) {


        myViewHolder.tvName.setText(DragonflyBTHelper.getDeviceName(bluetoothDevices.get(i)));
        int m= bluetoothDevices.get(i).getBondState();
        if(m==BluetoothDevice.BOND_BONDED)
        {

           myViewHolder.pairBtn.setText("Connect");
           myViewHolder.pairBtn.setTag("connect");
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    // Do something after 5s = 5000ms
                    autoConnect(bluetoothDevices.get(i),myViewHolder);
                }
            }, 1000);

        }
        else if (m==BluetoothDevice.BOND_BONDING)
        {
            myViewHolder.pairBtn.setText("Pairing");
            myViewHolder.pairBtn.setTag("pair");


        }else
        {
            myViewHolder.pairBtn.setText("Not paired");
            myViewHolder.pairBtn.setTag("pair");
        }

        myViewHolder.itemView.setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                if(m==BluetoothDevice.BOND_BONDED)
                {

                    autoConnect(bluetoothDevices.get(i),myViewHolder);                }
                else if(m==BluetoothDevice.BOND_NONE)
                {

                    bluetoothDevices.get(i).createBond();
                    myViewHolder.pairBtn.setText("Pairing");

                    Log.e("BT",bluetoothDevices.get(i).getName()+"---"+"pairing");

                }


            }
        });
    }

    public int getItemCount() {
        return bluetoothDevices == null ? 0 : bluetoothDevices.size();
    }

    public static class MyViewHolder extends ViewHolder {
        TextView tvName;
        LinearLayout linearLayout;
        TextView pairBtn;
        public MyViewHolder(View v) {
            super(v);
           tvName=v.findViewById(R.id.idTv);
           linearLayout=v.findViewById(R.id.linear);
           pairBtn=v.findViewById(R.id.pairBtn);
        }



    }
    public Object getElementByIndex(LinkedHashMap map, int index){
        return map.get( (map.keySet().toArray())[ index ] );
    }
    void autoConnect(BluetoothDevice bt,MyViewHolder myViewHolder)
    {
        if(bt!=null)
        {
            mcallback.connectDevice(bt);
            myViewHolder.pairBtn.setText("Connecting");
        }
    }
}