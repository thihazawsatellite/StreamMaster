﻿namespace StreamMaster.SchedulesDirectAPI.Models;

public class Account
{
    public DateTime expires { get; set; }
    public int maxLineups { get; set; }
    public object[] messages { get; set; }
}
