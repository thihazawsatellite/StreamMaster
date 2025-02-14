﻿using Microsoft.AspNetCore.Mvc;

using StreamMaster.SchedulesDirectAPI;
using StreamMaster.SchedulesDirectAPI.Models;

using StreamMasterApplication.SchedulesDirectAPI;
using StreamMasterApplication.SchedulesDirectAPI.Queries;

using StreamMasterDomain.Dto;

using System.Text;

namespace StreamMasterAPI.Controllers;

public class SchedulesDirectController : ApiControllerBase, ISchedulesDirectController
{
    [HttpGet]
    [Route("[action]")]
    public async Task<ActionResult<Countries?>> GetCountries()
    {
        return await Mediator.Send(new GetCountries()).ConfigureAwait(false);
    }

    [HttpGet]
    [Route("[action]")]
    public async Task<ActionResult<List<HeadendDto>>> GetHeadends(string country, string postalCode)
    {
        return await Mediator.Send(new GetHeadends(country, postalCode)).ConfigureAwait(false);
    }

    [HttpGet]
    [Route("[action]")]
    public async Task<ActionResult<LineUpResult?>> GetLineup(string lineup)
    {
        return await Mediator.Send(new GetLineup(lineup)).ConfigureAwait(false);
    }

    [HttpGet]
    [Route("[action]")]
    public async Task<ActionResult<List<LineUpPreview>>> GetLineupPreviews()
    {
        return await Mediator.Send(new GetLineupPreviews()).ConfigureAwait(false);
    }

    [HttpGet]
    [Route("[action]")]
    public async Task<ActionResult<LineUpsResult?>> GetLineups()
    {
        return await Mediator.Send(new GetLineups()).ConfigureAwait(false);
    }


    [HttpGet]
    [Route("[action]")]
    public async Task<ActionResult<List<SDProgram>>> GetSDPrograms()
    {
        return await Mediator.Send(new GetSDPrograms()).ConfigureAwait(false);
    }

    [HttpGet]
    [Route("[action]")]
    public async Task<ActionResult<List<Schedule>>> GetSchedules()
    {
        return await Mediator.Send(new GetSchedules()).ConfigureAwait(false);
    }
    [HttpGet]
    [Route("[action]")]
    public async Task<ActionResult<List<StationIdLineUp>>> GetSelectedStationIds()
    {
        return await Mediator.Send(new GetSelectedStationIds()).ConfigureAwait(false);
    }

    [HttpGet]
    [Route("[action]")]
    public async Task<ActionResult<List<StationPreview>>> GetStationPreviews()
    {
        return await Mediator.Send(new GetStationPreviewsRequest()).ConfigureAwait(false);
    }

    [HttpGet]
    [Route("[action]")]
    public async Task<ActionResult<List<Station>>> GetStations()
    {
        return await Mediator.Send(new GetStations()).ConfigureAwait(false);
    }

    [HttpGet]
    [Route("[action]")]
    public async Task<ActionResult<SDStatus>> GetStatus()
    {
        return await Mediator.Send(new GetStatus()).ConfigureAwait(false);
    }

    [HttpGet]
    [Route("[action]")]
    public async Task<IActionResult> GetEpg()
    {
        string xml = await Mediator.Send(new GetEpg()).ConfigureAwait(false);

        return new FileContentResult(Encoding.UTF8.GetBytes(xml), "application/xml")
        {
            FileDownloadName = "epg-schedules-direct.xml"
        };
    }
}
