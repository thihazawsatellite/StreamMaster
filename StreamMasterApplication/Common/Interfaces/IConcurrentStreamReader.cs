﻿using System.Collections.Concurrent;

namespace StreamMasterApplication.Common.Interfaces
{
    public interface IConcurrentStreamReader
    {
        ConcurrentDictionary<Guid, StreamingClientConfiguration> Clients { get; set; }
        Guid Id { get; set; }
        string StreamUrl { get; set; }

        Task CopyToAsync(StreamingClientConfiguration clientInfo);
        void Dispose();
    }
}