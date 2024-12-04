import React, { useState, useEffect, memo } from "react";
import { Table } from "react-bootstrap";
import DashboardNavigator from "../../partials/DashboardNavigator";
import { Row, Col } from "react-bootstrap";
import {
  getOrgAdminUserList,
  resetCSVjson,
  getOrgAdminUserResult,
} from "../../../redux-store/actions/orgAdminActions";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Redirect } from "react-router";
import {
  exportOrgAdminData,
  exportOrgAdminSelectedData,
} from "../../../redux-store/actions/orgAdminActions";
import { user_fields, server_base_url } from "../../../shared";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import moment from "moment";
import { BsSquare, BsCheck } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import Loading from "../../partials/Loading";
import Pagination from "../../partials/Pagination";

import { useJsonToCsv } from "react-json-csv";
import { Modal, Image } from "semantic-ui-react";

const UserList = () => {
  // const [addUserModalShow, setAddUserModalShow] = useState(false)
  // const [editUserModalShow, setEditUserModalShow] = useState(false)
  // const [removeUserModalShow, setRemoveUserModalShow] = useState(false)
  const [rowClicked, setRowClicked] = useState(false);
  const [rowIds, setRowId] = useState([]);
  const [modalImage, setModalImage] = useState("");
  // const [manageUser, setManageUser] = useState()
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [userExportId, setUserExportId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [offlineUserResult, setOfflineUserResult] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedRowsForExport] = useState([]);
  const [updating, setIsUpdating] = useState(false);

  const loadingImg =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAJYCAYAAACadoJwAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV8/pEUqDlaQ4pChOlkQFXHUKhShQqgVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6OSk6CIl/i8ptIjx4Lgf7+497t4B/maVqWZwHFA1y8ikkkIuvyqEXhFEDGHEMSgxU58TxTQ8x9c9fHy9S/As73N/jj6lYDLAJxDPMt2wiDeIpzctnfM+cZSVJYX4nHjMoAsSP3JddvmNc8lhP8+MGtnMPHGUWCh1sdzFrGyoxFPEcUXVKN+fc1nhvMVZrdZZ+578hZGCtrLMdZrDSGERSxAhQEYdFVRhIUGrRoqJDO0nPfwxxy+SSyZXBYwcC6hBheT4wf/gd7dmcXLCTYokgZ4X2/4YAUK7QKth29/Htt06AQLPwJXW8deawMwn6Y2OFj8C+reBi+uOJu8BlzvA0JMuGZIjBWj6i0Xg/Yy+KQ8M3AK9a25v7X2cPgBZ6ip9AxwcAqMlyl73eHe4u7d/z7T7+wFctHKe82DBLwAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YEGggmIt5A0HwAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAgAElEQVR42u3de5zVc/7A8feklMhPpEQppVa6yCDRz2W7bJvEZltrf7b6WbIp2xLJ2t0sdl1qc00klvwQ0S/JZdNFvyWyaaxJpVKie2wXjUY0nd8f+1iPvag553tmpjN6Ph+P/qj5fj/fy/lOc15zvpe8VCqVCgAAgApQxS4AAAAECAAAIEAAAAAECAAAIEAAAAAECAAAIEAAAAABAgAAIEAAAAABAgAAIEAAAAABAgAACBAAAAABAgAACBAAAAABAgAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAAAAgQAAECAAAAAAgQAAECAAAAAAgQAABAgAAAAAgQAABAgAAAAAgQAABAgAAAAAgQAABAgAACAAAEAABAgAACAAAEAABAgAACAAAEAAAQIAACAAAEAAAQIAACAAAEAAAQIAAAgQAAAAAQIAAAgQAAAAAQIAAAgQAAAAAECAAAgQAAAAAECAAAgQAAAAAECAAAIEAAAAAECAAAIEAAAAAECAAAIEAAAAAECAAAIEAAAQIAAAAAIEAAAQIAAAAAIEAAAQIAAAAACBAAAQIAAAAACBAAAQIAAAAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAIAAAQAAECAAAIAAAQAAECAAAIAAAQAABAgAAIAAAQAABAgAAIAAAQAABAgAACBA7AIAAECAAAAAAgQAAECAAAAAAgQAAECAAAAAAgQAABAgAAAAAgQAABAgAAAAAgQAABAgAACAAAEAABAgAACAAAEAABAgAACAAAEAAAQIAACAAAEAAAQIAACAAAEAAAQIAAAgQAAAAAQIAAAgQAAAAAQIAAAgQAAAAAECAAAgQAAAAAECAAAgQAAAAAECAAAgQAAAAAECAAAIEAAAAAECAAAIEAAAAAECAAAIEAAAQIAAAAAIEAAAQIAAAAAIEAAAQIAAAAACBAAAQIAAAAACBAAAQIAAAAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAIAAAQAAECAAAIAAAQAAECAAAIAAAQAAECAAAIAAAQAABAgAAIAAAQAABAgAAIAAAQAABAgAACBAAAAABAgAACBAAAAABAgAACBAAAAAAQIAACBAAAAAAQIAACBAAAAAAQIAAAgQAAAAAQIAAAgQAAAAAQIAAAgQAABAgAAAAAgQAABAgAAAAAgQAABAgAAAAALELgAAAAQIAAAgQAAAAAQIAAAgQAAAAAQIAAAgQAAAAAECAAAgQAAAAAECAAAgQAAAAAECAAAIEAAAAAECAAAIEAAAAAECAAAIEAAAQIAAAAAIEAAAQIAAAAAIEAAAQIAAAAACBAAAQIAAAAACBAAAQIAAAAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAIAAAQAAECAAAIAAAQAAECAAAIAAAQAABAgAAIAAAQAABAgAAIAAAQAABAgAACBAAAAABAgAACBAAAAABAgAACBAAAAAAQIAACBAAAAAAQIAACBAAAAAAQIAAAgQAAAAAQIAAAgQAAAAAQIAAAgQAAAAAQIAAAgQAABAgAAAAAgQAABAgAAAAAgQAABAgAAAAAIEAABAgAAAAAIEAABAgAAAAAIEAAAQIAAAAAIEAAAQIAAAAAIEAAAQIAAAgAABAAAQIAAAgAABAAAQIAAAgAABAAAECAAAgAABAAAECAAAgAABAAAECAAAIEDsAgAAQIAAAAACBAAAQIAAAAACBAAAQIAAAAACBAAA+OaqahcAUFZ27twZmzZtiqKiooiIOOCAA6J27dpRpYrfdwHwN34iAJC1NWvWxIMPPhidOnWKOnXqROPGjaNx48ZRp06d6NKlSzz44IOxdu1aOwqAyEulUim7AYAkduzYEc8880z86Ec/Smv6CRMmxHnnnRf77LOPnQewl/IJCACJ7Ny5M+6+++604yMi4vzzz4977703/O4LYO/lExAAEnnppZfirLPOSjTvtGnTonPnznYigAABIBc999xz8dZbb2U8X926dePyyy8v8/UpKiqKDh06RGFhYaL527dvHzNmzIiaNWt6cQH2Mu6CBVAJrFy5Mm666aaM5+vdu3e5rM/8+fMTx0dExJw5c2LBggVx0kkneXEB9jKuAQEgY++++27WYyxYsMCOBBAgsHeYMWNG5OXlJfpTUFBgB7LXW7duXU6MAYAAAWAvULVq9mfwVqtWzY4EECAAULr69etnPcZhhx1mRwIIEAAoXZs2bbIeo3Xr1nYkgAABgNIde+yx0a1bt8Tzn3vuuXHMMcfYkQACBABKV6NGjbj++usTzz9s2LDYd9997UgAAQIA6Tn55JNj0qRJGc/33HPPRX5+vh0IIEAAIDPf+973Yt68eWmdjtW9e/coKCiIHj162HEAezFPQgcgK/n5+TF58uR4++23o6CgIN5888147733IiLimGOOifbt20d+fn60bdvWrXcBECAAZK9atWrRrl27aNeuXfTv398OAWCXnIIFAAAIEAAAQIAAAAAIEIBvsry8PDsBAAECQMWoXr26nQCAAAFAgACAAAEQIACQkzwHBPYimzZtisLCwli5cmWsX78+PvrooygsLIwqVapEmzZtomHDhlGvXr1o2LBhtG7dOmrXrp1z27Bz585Yt25dvP/++7F+/frYuHFjfPzxx7FmzZpYvHhxbN269d+2pVWrVtGwYcOoUmXP/85lw4YNMXfu3Pjoo49i2bJlMWfOnKhbt260bNkyGjVqFO3bt49jjjkmqlb95/+e9913XwfwHvbXv/41Fi5cGIsXL47CwsL46KOPYtGiRdG2bds4+uij4/DDD4+2bdtGmzZtolatWhW+fkVFRbFixYpYtGhRLFu2LNavXx8ffvhhLFiwII477rho3Lhx1KtXL1q0aBHNmjWLhg0bRo0aNbywQMVLwV5o+vTpqYhI9GfevHmValu3bNmSeuWVV1LXXnttxtv6i1/8IjVr1qzUp59+uke3Yf369ak//elPqbvvvjt12mmnJXrdunTpknrwwQdTq1at2iPbUFhYmPrtb3+b1rp27do1NWPGjFRJSclX87/44ouJtrt3797ltk1z587Nue+j9957L6P1eOihh3Y73s6dO1OFhYWpX/3qV2mPWatWrdTvf//71CeffFLux9WOHTtS8+bNS1111VWJX4ts//z617/2QwXIiABBgHxDA+TLL79MTZ8+PZWfn5/1G4yTTjopNXPmzNSOHTsqdP0LCgpSw4YNK/M3TGPHjk1t3LixQrZj27ZtqTvvvDPRet5www2pTZs2ZXXMCpDd/7nuuut2Oda6deuyemOfn5+fmj17drlsZ0lJSWrWrFmpH/zgB3ssPAQIkJRrQOAbaNmyZfGzn/0sOnfuHAUFBVmPN3fu3OjYsWMMGjQoPvjgg3I/zWXSpElx1llnRX5+ftx4441lvox+/fpF+/bt47XXXivXbVm1alVceumlccUVVySa//rrr49LL700Nm3a5BSscvL6669/7b/PmzcvvvOd78TIkSMTj11QUBAdOnSIGTNmlOk6b968OW688cY488wz4+mnn/YiApWOAIFvkFQqFc8++2wcffTRcf/995f5+KNHj44mTZrE888/X+Zjb9myJR599NE46qij4rzzzotp06aV675asmRJnHbaaTFlypRyGf/DDz+MTp06xWOPPZbVOE8//XQMHTo0ioqKHODlYNasWbFt27av/r5jx4547LHH4sQTT4zCwsIyWUbnzp1j/vz5ZTLWwoULo2fPnnHDDTd48QABAuxZO3fujDFjxkTPnj3LfVk9evSIhx56KHbu3Jn1WMXFxfHss8/GqaeeGn379o2tW7dW6H4755xz4tFHH41UKlVmY27evDkGDhwYS5YsKZPxxo4dG5deeqmDvJxs3Ljxq++he++9N3r37l3my7j00kv/KXSSWLp0aXTt2jVmzZrlRQMECLBnpVKpGDduXFx22WUVtsxLLrkkHn/88azGKCwsjK5du0bPnj1j4cKFe2z/9e3bt8ze1G3fvj1uuOGGeOGFF8p0HVetWuVALyd//etfIyLiiSeeSHy6XGnmzJmT1ad6a9asiT59+jgOAAEC5IZp06bFT37ykwpfbp8+fbI6v/3QQw+Nv/zlLzmxD/v37x/r16/Pepynnnoq7rzzTgdlJbJ+/fp48cUXy+WTj3904403JjqVbtu2bTFgwICYM2eOFwsQIMCet27durj44ov32PIHDBgQGzZsSDRv/fr14+67786J/bhkyZIYPnx4lJSUZPVG9vLLL3dQVjK9evWK7t27l/tyCgoKEl1X8uKLL8bkyZO9UIAAAfa8kpKSGDFixB49LWPJkiVx++23J74e5Lzzzov8/Pyc2J+33357/PnPf048//jx4yv8GhayV5Gv2a7uurUrGzdujKFDhyZe3qBBg+L3v/999O/f3wsNCBAgey+//HLcfvvte3w9brvttnjllVcSzXvggQfGb3/725zZp0888USi+VasWBFXXnmlg5LdGjt2bGzfvj3t6Z9++ulYvnx5xsvp169frF69Ou6666646qqr4r777ovly5dXyE0qAEpT1S6AymnTpk1lcmek888/PyIiJkyYkNU4AwYMiD//+c/xH//xHxnP26lTp+jZs2dMmjQp7Xm+//3vR8uWLePwww+P6tWrx+rVq+PRRx/N+s5To0aNisGDB8dRRx2V0XxPPvlkmbyu+fn5UVRUVGZ30CK3LFmyJFavXh1NmjQpddri4uIYNmxYxsvo2LFjDB8+PA466KB/+vejjjoqRo0aFe+8805GUdO9e/fYf//9d/n1Qw45xAsLZMazGPEk9Mr5JPTJkydn9fTicePGpbZs2fLVeJs2bUqNHTs2qzFffPHFxNvz5ptvljr+kCFDUjNmzEitX79+l08dnzp1aqpJkyZZbcfo0aMzWvetW7ematWqldUyr7jiitTy5ctTJSUlqZ07d6bWr1+fGj9+fNbjehJ6dn+uvfba1KRJk1KzZ89OPf/886nLLrss6zHfeOONtLblnXfeSTT+jBkzdjvuE088UabjAWRKgCBAKmGAfPnll6muXbuWSyg8/fTTicc999xzUzt27Ei0TSUlJalBgwZ97bgjR45MLV++PO2xPvroo1T79u0Tb0eTJk1SX375ZdrLe+ONN7J6Qzp48OBUcXHx1469cOHCVH5+vgCp4ADp2rVrqqCg4GuP0/Hjx2c19sSJE9PalocffjjjsWvVqpUqKira7birV6/OaMyOHTumtm/f7gcHUGZcAwKVUGFhYUydOjXRvLfeemt069Ztt6c2XXfddYnGnjx5cixYsCDRvFWqVPm3O0iNHDky1q5dm/EpUQ0bNow//OEPiffv8uXLY926dWlPn82tiI899tj41a9+FTVq1Pjar7do0SIefvhhB30FOu2002LcuHFx/PHHf+1xev7552d1y94PPvggnbMTEp3Wd9lll+32dKmIv919rmvXrmmPOXPmzMTf1wBf+zPfLoDKZ+LEiYnn/fGPf7zbr+fl5WX1TJFsbhfarFmzGDFiRAwdOjSWLVsWgwcPjsMOOyzRWC1atIh77rmnXN8kRkQUFRXFbbfdlng5w4cPj9q1a+92mjZt2mS1DNJXt27deOSRR6JevXq7jeVsLuZes2ZNqdN8+umniX7J0Lp161KnycvLi29/+9sZjft///d/Dg5AgMDe6pNPPombb7450bw33HBDHHHEEaVO17Rp0xg8eHCiZQwbNiw2bdqUePsGDhwYt9xyS1oX6ZamR48eieddtGhRWtMtXrw48W1cGzRoEGeeeWZa05b2W23KxpgxY9I69r7u05F0bdmypdRptm3blmjsdG8CkemF41OmTHFwAAIE9lYrVqxIPG+nTp3SnnZ3p2mV5sMPP0w873777Rd5eXllsq8aNWqU+FSZdH/jm822DhkyRFjkkAsuuCDOOuuscnkD/482btxY6jRJnpge8bfbWqfjX++QVZqZM2emtd4AAgS+gRYvXpx43mOPPTbtadM5lWNXli5dmjP7K91PGP7V9OnT05ou3U9Kvs5pp53mgM4hF110Uey7775pTbura3bSsXbt2lKnSfqpWq1atdKaLsntsj/99FMHCSBAYG80Z86cRPN169at1GsN/lHdunXjpJNOSrSsuXPn5sz+atq0aaL5NmzYkNYD42bOnJl43Ro3buyAziH77LNP2tNWq1YtmjdvXm7fw0kDpGbNmmUaKv+ouLjYQQIIENjbFBcXx6hRoxLN27Fjx4ymz8vLi+7duyda1rhx4+KLL77IiX2W5I3W333++ee7/fqWLVsSB8i5556bURCSe1q0aFF+P5yrJPvx/OWXX6Y1XZLvz1z5ngYECFCBVq9enXjeJL+tzeSUrX+0YcOGrNY1W6lUKjZu3BjvvvtuFBQUlFuArF+/PvHYp59+ugO6kqtevXrOjZ3utSNJPmFxvRJQVqraBVB5pHP7zl1JctFsnTp1Ei9v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+vXrFzVq1Pi3r3fp0qXCXoNq1apFnz59Yt68eYke1lerVq2YM2fOv/328aijjnKA74XefffdnAyQJ598MtatW1emY7Zq1SpeffXVjC5crlu3bvzxj3+MFi1a5My+sR25tR0IEKACVK1aNbp06RJ/+tOfYsaMGTFkyJCMx7jmmmti5syZ8corr0Tnzp2jatXyfXZp586d4/XXX49HHnkko2s2+vXrFzNnzoypU6fu9hqJPfHDMD8/P6ZOnRrPPvts2udC33777bF48eI4+eST/+1rnjWy93n55ZejdevWUVBQkJPrt2jRojIf8z//8z+joKAgrU9y+/fvH6+//nqceuqpObdvbAd8vbxUWV9BBuSsjRs3RmFhYaxcuTLWrVsXK1eujPnz50dEROvWrePII4+MevXqxZFHHhlt2rT5p1OYKlpxcXG8//778fbbb8eyZcti1apVMX/+/Khbt260adMmGjVqFPXr14/WrVtXmk8FSkpKYtGiRfHuu+/G2rVr44MPPog5c+bE/vvvH61atYpTTjklOnToEI0aNXKwEhERM2fOTPtOc88//3y0adMm5s6dG/Pnz4+VK1fGJ598EmvWrIm5c+eW2zrecccd5fZA1J07d8aCBQvirbfeijlz5sSCBQu++v/q5JNPjhNOOCFatmxZJtejlSfbAQIEAHLehx9+GO3atYsNGzaUOu3gwYNj+PDhpT4QdOfOnfH5559HcXFxFBUVRWFhYTz55JPxxBNPJF7PoUOHeggnkBGJCgA5pri4OK655pq04iPib7ecLi0+Iv52vVXNmjXjkEMOiUaNGkWPHj3isccei5kzZyZe15UrV3rBAAECAJXZnDlzYsKECWlN27Nnz6yub8rLy4tvf/vb8dBDDyWa/9133/WCAQIEACqrVCoVjz/+eNrTn3322WVyW+x0rzX5V82aNfOiAQIEACqrDz74IKNPIxo3blwmy61Xr16i+b71rW950QABAgCV1YoVKzKafv/99y+T5Sa9zXbDhg29aIAAAYDKKt0Lz/9ux44dZbLczZs3J5rvsMMO86IBAgQAKqtMnyy+evXqMlluYWFhovnatGnjRQMECABUVkVFRRlN/+STT0ZJSUlWyywuLo6777474/l+8IMfVJoHgQICBAD4GkcccURG00+aNCleeeWVxMsrKSmJMWPGxOTJkzOe98ILLyyTO3ABAgQA2EOSXFNx4YUXxty5czOe77PPPos777wzrrzyyoznbdKkSXTo0MELBggQANjbAmTDhg3Rrl27uP/+++Pjjz8udfrt27fH7Nmz44c//GFcffXVidZz1KhRUadOHS8YkLG8VCqVshsAIDd88cUX0blz53j11VcTjzFkyJA4+eSTo2HDhrH//vtH1apVY9u2bbF58+aYP39+jB8/PubMmZN4/AEDBsRdd92V+Na9gAARIACQQyZOnBi9evXKyXVr3rx5TJ8+3fM/gMScggUAOaZjx445eX3FscceG1OmTBEfQFZ8AgIAOWjBggXRqlWrnFmfNm3axMSJE+Poo4/24gBZ8QkIAOSgli1bxvPPP58T63L++efHs88+Kz6AMuETEADIYW+++Wb06dMnlixZskeWP378+OjZs2dUr17diwGUCZ+AAEAOO/nkk2PmzJkxYMCACl3uoEGDYsWKFXHBBReID6BM+QQEACqBVCoVhYWFMWbMmLjvvvvKZRnNmzePIUOGRKdOneKoo46y0wEBAgBCJBXLly+PgoKCeOaZZ2LChAlZjdelS5c466yz4oQTTogTTjghatasaScDAgQA+Hrr16+PdevWxapVq2L58uXx4YcfxqZNm2Lt2rWxePHiqFu3bhx99NFRv379OPjgg+Oggw6KOnXqRNOmTePII4+MQw45xE4EBAgAAPDN5CJ0AABAgAAAAAIEAABAgAAAAAIEAABAgAAAAAIEAAAQIAAAAAIEAAAQIAAAAAIEAAAQIAAAgAABAAAQIAAAgAABAAAQIAAAgAABAAAECAAAgAABAAAECAAAgAABAAAECAAAIEAAAAAECAAAIEAAAAAECAAAIEAAAAABAgAAIEAAAAABAgAAIEAAAAABAgAAIEAAAAABAgAACBAAAAABAgAACBAAAAABAgAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAAAAgQAAECAAAAAAgQAAECAAAAAAgQAABAgAAAAAgQAABAgAAAAAgQAABAgAACAAAEAABAgAACAAAEAABAgAACAAAEAABAgAACAAAEAAAQIAACAAAEAAAQIAACAAAEAAAQIAAAgQAAAAAQIAAAgQAAAAAQIAAAgQAAAAAECAAAgQAAAAAECAAAgQAAAAAECAAAIEAAAAAECAAAIEAAAAAECAAAIEAAAQIAAAAAIEAAAQIAAAAAIEAAAQIAAAAAIEAAAQIAAAAACBAAAQIAAAAACBAAAQIAAAAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAIAAAQAAECAAAIAAAQAAECAAAIAAAQAABAgAAIAAAQAABAgAAIAAAQAABAgAACBAAAAABAgAACBAAAAABAgAACBAAAAAAQIAACBAAAAAAQIAACBAAAAAAQIAACBAAAAAAQIAAAgQAAAAAQIAAAgQAAAAAQIAAAgQAABAgAAAAAgQAABAgAAAAAgQAABAgAAAAAIEAABAgAAAAAIEAABAgAAAAAIEAAAQIAAAAAIEAAAQIAAAAAIEAAAQIAAAgAABAAAQIAAAgAABAAAQIAAAgAABAAAQIAAAgAABAAAECAAAgAABAAAECAAAgAABAAAECAAAIEAAAAAECAAAIEAAAAAECAAAIEAAAAABAgAAIEAAAAABAgAAIEAAAAABAgAACBAAAAABAgAACBAAAAABAgAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAAAAgQAAECAAAAAAgQAAECAAAAAAgQAABAgAAAAAgQAABAgAAAAAgQAABAgAACAAAEAABAgAACAAAEAABAgAACAAAEAAAQIAACAAAEAAAQIAACAAAEAAAQIAAAgQAAAAAQIAAAgQAAAAAQIAAAgQAAAAAECAAAgQAAAAAECAAAgQAAAAAECAAAgQAAAAAECAAAIEAAAAAECAAAIEAAAAAECAAAIEAAAQIAAAAAIEAAAQIAAAAAIEAAAQIAAAAACBAAAQIAAAAACBAAAQIAAAAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAIAAAQAAECAAAMA3yf8DUeAchTqBylMAAAAASUVORK5CYII=";

  var { useroptions } = useSelector((state) => state.orgAdminUserList);
  var { user_results, fetching_user_results } = useSelector(
    (state) => state.orgAdminUserResult
  );
  const { exportable_json, exporting, export_data_received } = useSelector(
    (state) => state.orgAdminExportData
  );
  const dispatch = useDispatch();

  const updateUserList = async () => {
    if (!fromDate) {
      alert("Please Select From Date");
      return;
    }
    if (!toDate) {
      alert("Please Select To Date");
      return;
    }
    setIsUpdating(true);
    await dispatch(
      getOrgAdminUserResult(
        currentPage,
        usersPerPage,
        fromDate,
        toDate,
        userExportId
      )
    );
    setIsUpdating(false);
  };

  useEffect(() => {
    if (window.navigator.onLine) {
      async function getUserList() {
        await dispatch(getOrgAdminUserList(currentPage, usersPerPage));
        await dispatch(getOrgAdminUserResult(currentPage, usersPerPage));
      }
      getUserList();
    } else {
      if (window.NativeDevice) {
        alert("Please check network of your mobile device.");
        //setOfflineUserResult(json)
        //window.NativeDevice.dashboardofflinecall()
        async function getUserList() {
          await dispatch(getOrgAdminUserList(currentPage, usersPerPage));
          await dispatch(getOrgAdminUserResult(currentPage, usersPerPage));
        }
        getUserList();
      } else {
        alert("Please check your network.");
        //setOfflineUserResult(json)
      }
    }

    const datePickers = document.getElementsByClassName(
      "react-datepicker__input-container"
    );
    Array.from(datePickers).forEach((el) =>
      el.childNodes[0].setAttribute("readOnly", true)
    );
  }, [currentPage]);

  if (window)
    window.getOfflineData = function (json) {
      alert("offline dashboard is called.");
      setOfflineUserResult(json);
    };

  // const handleRemoveConfirmation = ()=>{
  //     setRemoveUserModalShow(true)
  // }
  // const handleRemove = ()=>{
  //     dispatch(removeOrgAdminUser(rowId))
  //     clearSelectedRow()
  //     setManageUser(Math.random())
  // }
  //
  // const handleEdit = ()=>{
  //     setEditUserModalShow(true)
  // }

  /* old code below
    const manageUserList = () => {
        setManageUser(Math.random())
    }
    */
  const handleRowClick = (
    row_id,
    sampleID,
    serialNo,
    created_at,
    testerId,
    result,
    error
  ) => {
    setRowId((prev) => [...prev, row_id]);
    selectedRowsForExport.push({
      row_id,
      sampleID,
      serialNo,
      created_at,
      testerId,
      result,
      error,
    });
    setRowClicked(true);
  };

  const clearSelectedRow = (row_id) => {
    setRowClicked(false);
    var cur_row = 0;
    selectedRowsForExport.map((index, i) => {
      if (index.row_id === row_id) {
        return cur_row = i;
      }
      return null;
    });
    if (cur_row > -1) {
      selectedRowsForExport.splice(cur_row, 1); // 2nd parameter means remove one item only
    }
    setRowId((prev) => prev.filter((id) => id !== row_id));
  };

  const { saveAsCsv } = useJsonToCsv();

  const filename = "exported-result";

  const exportData = async () => {
    var datesavailable = true;
    if (toDate === null && typeof toDate === "undefined") {
      setErrorMsg("Please select a time period");
      datesavailable = false;
    }
    if (fromDate === null && typeof fromDate === "undefined") {
      setErrorMsg("Please select a time period");
      datesavailable = false;
    }
    if (toDate.length <= 0) {
      setErrorMsg("Please select a time period");
      datesavailable = false;
    }
    if (fromDate.length <= 0) {
      setErrorMsg("Please select a time period");
      datesavailable = false;
    }

    if (selectedRowsForExport && selectedRowsForExport.length > 0) {
      await dispatch(exportOrgAdminSelectedData(selectedRowsForExport));
    } else {
      //Selected ones available or not
      if (datesavailable === true) {
        await dispatch(
          exportOrgAdminData(
            moment(fromDate).format("YYYY-MM-DD"),
            moment(toDate).format("YYYY-MM-DD"),
            userExportId
          )
        );
      }
    }
    setErrorMsg("");
  };

  const handleToDateChange = (date) => {
    setErrorMsg("");
    setToDate(date);
  };

  const handleFromDateChange = (date) => {
    setErrorMsg("");
    setFromDate(date);
  };

  const downloadData = (data) => {
    const fields = user_fields;
    if (data && data.length !== 0) {
      if (window.NativeDevice) {
        window.NativeDevice.exportCSV(JSON.stringify({ data }));
      } else {
        saveAsCsv({ data, fields, filename });
      }
    } else alert("No results");

    dispatch(resetCSVjson());
  };

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // console.log(currentPage);
  };

  // Get current users page
  const totalResults = JSON.parse(localStorage.getItem("pdxTableTotalRows"));

  const handleModalOpen = async (image, id) => {
    //call axios here
    setModalImage(loadingImg);
    if (window.navigator.onLine) {
      //Offline mode
      const accessToken = JSON.parse(
        localStorage.getItem("userInfo")
      ).auth0_access_token;
      const jsondata = {
        test_id: id,
      };
      const url = `${server_base_url}/image`;
      let { data } = await axios({
        method: "get",
        url: url,
        headers: {
          "Content-Type": "application/json",
          "X-AuthorityToken": "auth-wpf-desktop",
          "X-AccessToken": accessToken,
        },
        params: jsondata,
      });
      setModalImage("data:image/png;base64," + data);
    } else {
      if (window.NativeDevice) {
        let img = window.NativeDevice.getImageFromDevice(image);
        setModalImage(img);
      }
    }
  };
  const handleModalClose = () => {
    setModalImage("");
  };

  const displayUserDiagnosis = (user) => {
    const diagnosis = [];
    if (user.covid) {
      diagnosis.push("OPXV");
    }
    if (user.influenzaA) {
      diagnosis.push("MPXV I/II");
    }
    if (user.influenzaB) {
      diagnosis.push("VZV");
    }
    if (user.rhino) {
      diagnosis.push("HSV 1");
    }
    if (user.rsv) {
      diagnosis.push("HSV 2");
    }
    if (user.invalid) {
      diagnosis.push("Cancelled");
    }
    if (user.controls) {
      diagnosis.push("Invalid");
    }
    return diagnosis.join("/");
  };

  return (
    <>
      <Modal
        open={modalImage}
        className="!m-auto !flex"
        style={{
          width: "140vh",
          height: "80vh",
          margin: "auto",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input
          type="image"
          style={{
            width: "2.5vw",
            right: "2vw",
            top: "2vw",
            position: "absolute",
          }}
          src="assets/icons/close.svg"
          onClick={handleModalClose}
          alt="cropimgmod"
        />
        <Image
          style={{
            margin: "auto",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            position: "absolute",
            width: "120vh",
            height: "70vh",
            objectFit: "contain",
          }}
          src={modalImage}
        />
      </Modal>
      <div style={{ overflow: "hidden", display: "grid" }}>
        {!localStorage.getItem("userInfo") && <Redirect to="/login" />}
        {/* <NavigationBar /> */}
        <DashboardNavigator
          btn1={"Organization Dashboard"}
          link1={"/org-admin/org-dashboard"}
          btn2={"User Tests"}
          link2={"/org-admin/userlist"}
          comp={"userlist"}
        />
        {useroptions && (
          <div className="orglist-card separator">
            <p className="dataexport" style={{paddingBottom: "5px"}}>Data Export</p>
            <Row>
              {/* <Col sm='1'></Col> */}
              <Col sm="2">
                <div className="export-label">From</div>
                <div>
                <DatePicker
                  selected={fromDate}
                  onChange={handleFromDateChange}
                  dateFormat="yyyy-MM-dd"
                  disabledKeyboardNavigation
                  onFocus={(e) => e.target.blur()}
                />
                </div>
              </Col>
              <Col sm="2">
                <div className="export-label">To</div>
                <div>
                <DatePicker
                  selected={toDate}
                  onChange={handleToDateChange}
                  dateFormat="yyyy-MM-dd"
                  disabledKeyboardNavigation
                  onFocus={(e) => e.target.blur()}
                />
                </div>
              </Col>
              <Col sm="2">
                <div className="export-label">User</div>
                <div>
                <select
                  className="select-dark"
                  value={userExportId}
                  style={{ padding: "8px" }}
                  onChange={(e) => setUserExportId(e.target.value)}
                >
                  {useroptions.map((option) =>
                    option.value === "" ? (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ) : (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    )
                  )}
                </select>
                </div>
              </Col>
              <Col sm="2" style={{display: "flex", alignItems: "flex-end"}}>
                {!updating ? (
                  <div style={{display: "flex"}}>
                    <div className="export-error">{errorMsg}</div>
                    <div>
                      <button
                        onClick={updateUserList}
                        className="protondx-btn-primary btn-sm"
                      >
                        Update Results
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{display: "flex"}} className="export-btn separator">
                    <button
                      disabled={true}
                      className="protondx-btn-primary btn-sm"
                    >
                      Updating...
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                )}
              </Col>
              <Col sm="2" style={{display: "flex", alignItems: "flex-end"}}>
                {!exporting ? (
                  <div  style={{display: "flex"}}>
                    <div className="export-error">{errorMsg}</div>
                    <div>
                      <button
                        onClick={exportData}
                        className="protondx-btn-primary btn-sm"
                      >
                        Export Results
                      </button>
                    </div>
                  </div>
                ) : (
                  <div  style={{display: "flex"}} className="export-btn separator">
                    <button
                      disabled={true}
                      className="protondx-btn-primary btn-sm"
                    >
                      Exporting...
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                )}
              </Col>
            </Row>
            {/* <Row style={{paddingLeft: "8px"}}>

                        </Row> */}
            {export_data_received && downloadData(exportable_json)}
          </div>
        )}

        <div className="orglist-card separator pdx-table">
          <Table>
            <thead>
              <tr className="th-color">
                <th style={{ width: "6%" }}>
                  <BiEdit />
                </th>
                <th style={{ width: "8%" }}>Sample ID</th>
                <th style={{ width: "8%" }}>Serial No</th>
                <th style={{ width: "10%" }}>Date</th>
                <th style={{ width: "10%" }}>Time</th>
                <th style={{ width: "10%" }}>User</th>
                <th style={{ width: "10%" }}>Panel</th>
                <th style={{ width: "15%" }}>Results</th>
                <th style={{ width: "5%" }}>Image</th>
                <th style={{ width: "15%" }}>Comments</th>
                <th style={{ width: "3%" }}></th>
                {/* <th>Tag</th> */}
              </tr>
            </thead>
            <tbody>
              {user_results &&
                user_results.map((user) => (
                  <tr key={user._id.$oid}>
                    {rowIds.includes(user._id.$oid) ? (
                      <td style={{ width: "6%" }}>
                        <button
                          className="edit-btn"
                          onClick={() => clearSelectedRow(user._id.$oid)}
                        >
                          <BsCheck />
                        </button>
                      </td>
                    ) : (
                      <td>
                        <button
                          className="non-edit-btn"
                          onClick={() => {
                            handleRowClick(
                              user._id.$oid,
                              user.sampleID,
                              user.serialNo,
                              user.created_at
                                ? user.created_at.slice(0, 19)
                                : "",
                              user.testerId,
                              displayUserDiagnosis(user),
                              user.error
                            );
                          }}
                        >
                          <BsSquare />
                        </button>
                      </td>
                    )}
                    {/*<td style={{width: "6%"}}>
                                        <button
                                            className='non-edit-btn'
                                        >
                                            <BsSquare />
                                        </button>
                                    </td> */}
                    <td style={{ width: "8%" }}>{user.sampleID}</td>
                    <td style={{ width: "8%" }}>{user.serialNo}</td>
                    <td style={{ width: "10%" }}>
                      {user.created_at ? user.created_at.slice(0, 10) : ""}
                    </td>
                    <td style={{ width: "10%" }}>
                      {user.created_at ? user.created_at.slice(11, 19) : ""}
                    </td>
                    <td style={{ width: "10%" }}>{user.name}</td>
                    <td style={{ width: "10%" }}>
                      {user.testerId === "100040" && "OPXV"}
                      {user.testerId === "100051" && "Respiratory"}
                      {user.testerId === "100006" && "Sample"}
                      {user.testerId === "100104" && "Sample"}
                      {user.testerId === "100350" && "Sample"}
                      {user.testerId === "100069" && "Respiratory"}
                      {user.testerId !== "100040" &&
                        user.testerId !== "100051" &&
                        user.testerId !== "100006" &&
                        user.testerId !== "100104" &&
                        user.testerId !== "100350" &&
                        user.testerId !== "100069" && (
                          <div>
                            None
                            {/* <GrClose /> */}
                          </div>
                        )}
                    </td>
                    <td style={{ width: "15%" }}>
                      {!user.covid &&
                        !user.influenzaA &&
                        !user.influenzaB &&
                        !user.rhino &&
                        !user.rsv &&
                        !user.controls &&
                        !user.invalid && <div>Not Detected</div>}
                      {displayUserDiagnosis(user)}
                    </td>
                    {typeof user.image !== "undefined" && user.image !== "" ? (
                      <td
                        style={{ width: "5%" }}
                        onClick={() =>
                          handleModalOpen(user.image, user._id.$oid)
                        }
                      >
                        {/* <Icon name="file outline" /> */}{" "}
                        <img
                          style={{ width: "1.5vw" }}
                          alt="img-pull"
                          src="assets/icons/icon-image.svg"
                        />
                      </td>
                    ) : (
                      <td>None</td>
                    )}
                    <td style={{ width: "15%" }}>{user.comments}</td>
                    <td>
                      {user.error ? (
                        <svg
                          id="Icon_flag"
                          className="w-[3.47vh]"
                          data-name="Icon / flag"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40"
                        >
                          <g id="MDI_flag" data-name="MDI / flag">
                            <g
                              id="Boundary"
                              fill="#8b8b8b"
                              stroke="rgba(0,0,0,0)"
                              strokeWidth="1"
                              opacity="0"
                            >
                              <rect width="40" height="40" stroke="none" />
                              <rect
                                x="0.5"
                                y="0.5"
                                width="39"
                                height="39"
                                fill="none"
                              />
                            </g>
                            <path
                              id="Path_flag"
                              data-name="Path / flag"
                              d="M24.427,7.882,23.6,4H5V37H9.133V23.412H20.707l.827,3.882H36V7.882Z"
                              fill={`#D94444`}
                            />
                          </g>
                        </svg>
                      ) : (
                        ""
                      )}
                    </td>
                    {/* <td>{user.invalid}</td> */}
                  </tr>
                ))}

              {/* FOR OFFLINE DATA */}
              {offlineUserResult &&
                offlineUserResult.map(
                  (user) =>
                    user.name && (
                      <tr key={user._id.$oid}>
                        {/* {
                            rowId == user._id.$oid ?
                        <td>
                            <button
                                className = 'edit-btn'
                                onClick={clearSelectedRow}
                                >
                                <BsCheck />
                            </button>
                        </td>:

                        <td>
                            <button
                                className='non-edit-btn'
                                onClick={()=>{handleRowClick(user._id.$oid, user.name, user.surname, user.email)}}
                            >
                             <BsSquare />
                            </button>
                        </td>
                        } */}
                        <td>{user.user_id}</td>
                        <td>{user.created_at.slice(0, 10)}</td>
                        <td>{user.created_at.slice(12, 19)}</td>
                        <td>{user.user}</td>
                        <td>{user.prepKitId}</td>
                        <td>{user.result}</td>
                        <td>{user.tag}</td>
                      </tr>
                    )
                )}
            </tbody>
            {totalResults && (
              <div className="paginator">
                <Pagination
                  rowsPerPage={usersPerPage}
                  totalRows={totalResults}
                  paginate={paginate}
                />
              </div>
            )}
          </Table>
          <div className="separator">
            {fetching_user_results && <Loading />}
          </div>
        </div>

        {/* <AddUser
            show={addUserModalShow}
            onHide={() => setAddUserModalShow(false)}
            manageUserList={()=>manageUserList()}
        />

        <EditUser
            user_id ={rowId}
            first_name={editableFirstName}
            surname={editableSurname}
            email={editableEmail}
            show={editUserModalShow}
            unSelectRow={()=>clearSelectedRow()}
            onHide={() => setEditUserModalShow(false)}
            manageUserList={()=>manageUserList()}
        />

        <RemoveUserConfirmation
            user_name={editableFirstName}
            show={removeUserModalShow}
            handleRemove={()=>handleRemove()}
            unSelectRow={()=>clearSelectedRow()}
            onHide={() => setRemoveUserModalShow(false)}
        />
            <div className='separator'>
                <button className='org-manager-btn' onClick={() => setAddUserModalShow(true)}>
                    Add
                </button>

                {rowClicked ?
                <>
                    <button className='org-manager-btn'
                     onClick={handleEdit}>
                     Edit
                    </button>
                    <button className='org-manager-btn'
                        onClick={handleRemoveConfirmation}
                    >
                        Remove
                    </button>
                </>
                    :
                <>
                    <button className='org-manager-btn'  disabled = 'true'>
                        Edit
                    </button>
                    <button className='org-manager-btn'  disabled='true'>
                        Remove
                    </button>
                </>
                }

            </div> */}
      </div>
    </>
  );
};

export default memo(UserList);
